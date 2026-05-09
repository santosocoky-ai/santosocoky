import { motion } from 'motion/react';
import type { Project } from '../types';
import { ExternalLink, Github } from 'lucide-react';

export default function PortfolioGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <div className="aspect-video flex items-center justify-center border-2 border-dashed border-black/10 rounded-3xl bg-black/[0.02]">
        <p className="text-black/40 font-medium">Belum ada proyek yang ditampilkan.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project, idx) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
          viewport={{ once: true }}
          className="group"
        >
          <div className="relative aspect-video overflow-hidden rounded-3xl bg-black/5 mb-4">
            <img
              src={project.image_url}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
              {project.live_url && (
                <a href={project.live_url} className="p-3 bg-white rounded-full hover:scale-110 transition-transform">
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
              {project.repo_url && (
                <a href={project.repo_url} className="p-3 bg-white rounded-full hover:scale-110 transition-transform">
                  <Github className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
          <h3 className="text-xl font-bold">{project.title}</h3>
          <p className="text-black/60 text-sm mt-2 line-clamp-2">{project.description}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {project.tech_stack.map((tech) => (
              <span key={tech} className="text-[10px] font-bold px-2 py-1 bg-black/5 rounded uppercase">
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
