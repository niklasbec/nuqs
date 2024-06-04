import { cn } from '@/src/lib/utils'
import Image from 'next/image'
import { z } from 'zod'

const dependentSchema = z.object({
  stars: z.number(),
  owner: z.string(),
  name: z.string(),
  pkg: z.string(),
  avatarURL: z.string(),
  version: z.string().nullable(),
  createdAt: z.string().transform(date => new Date(date))
})
type Dependent = z.infer<typeof dependentSchema>

export async function fetchDependents() {
  const data = await fetch('https://dependents.47ng.com', {
    next: {
      revalidate: 86_400
    }
  }).then(res => res.json())
  return z.array(dependentSchema).parse(data)
}

export async function DependentsSection() {
  let dependents: Dependent[] = []
  try {
    dependents = await fetchDependents()
  } catch (error) {
    console.error(error)
    return <section className="text-red-500">{String(error)}</section>
  }
  return (
    <section className="container">
      <h2 className="mb-8 text-center text-3xl font-bold tracking-tighter dark:text-white md:text-4xl xl:text-5xl">
        Used by
      </h2>
      <p className="my-8 flex justify-center">
        <a href="https://vercel.com">
          <svg
            aria-label="Vercel"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 284 65"
            className="inline h-8 fill-black dark:fill-white md:h-10"
          >
            <path d="M141.68 16.25c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.46 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zm117.14-14.5c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.45 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zm-39.03 3.5c0 6 3.92 10 10 10 4.12 0 7.21-1.87 8.8-4.92l7.68 4.43c-3.18 5.3-9.14 8.49-16.48 8.49-11.05 0-19-7.2-19-18s7.96-18 19-18c7.34 0 13.29 3.19 16.48 8.49l-7.68 4.43c-1.59-3.05-4.68-4.92-8.8-4.92-6.07 0-10 4-10 10zm82.48-29v46h-9v-46h9zM37.59.25l36.95 64H.64l36.95-64zm92.38 5l-27.71 48-27.71-48h10.39l17.32 30 17.32-30h10.39zm58.91 12v9.69c-1-.29-2.06-.49-3.2-.49-5.81 0-10 4-10 10v14.8h-9v-34h9v9.2c0-5.08 5.91-9.2 13.2-9.2z" />
          </svg>
        </a>
      </p>
      <div className="flex flex-wrap justify-center gap-1.5">
        {dependents.map(dep => (
          <a
            key={dep.owner + dep.name}
            href={`https://github.com/${dep.owner}/${dep.name}`}
            className="relative h-8 w-8 rounded-full"
          >
            <Image
              src={upscaleGitHubAvatar(dep.avatarURL, 64)}
              alt={dep.owner + '/' + dep.name}
              className="rounded-full"
              width={64}
              height={64}
            />
            <span
              className={cn(
                'absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background',
                dep.pkg === 'nuqs' ? 'bg-green-500' : 'bg-zinc-500'
              )}
              aria-label={`Using ${dep.pkg}`}
            />
          </a>
        ))}
      </div>
    </section>
  )
}

function upscaleGitHubAvatar(originalURL: string, size: number) {
  const url = new URL(originalURL)
  url.searchParams.set('s', size.toFixed())
  return url.toString()
}
