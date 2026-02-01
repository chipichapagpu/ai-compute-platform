export type Category =
  | "quantization"
  | "attention"
  | "kv-cache"
  | "batching"
  | "memory"
  | "frameworks"

export interface CategoryMeta {
  slug: Category
  title: string
  description: string
  icon: string // emoji
  seoContent?: string
}

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: "quantization",
    title: "Quantization",
    description: "Reduce model precision to save VRAM and increase throughput",
    icon: "📊",
    seoContent: "Quantization is the most impactful optimization for reducing LLM memory requirements. By converting model weights from 16-bit floating point to 8-bit or 4-bit integers, you can cut VRAM usage by 2-4x with minimal quality loss. Modern quantization methods like GPTQ, AWQ, and GGUF preserve model accuracy while dramatically reducing hardware costs. Whether you're deploying on consumer GPUs or scaling in the cloud, quantization makes previously impossible configurations viable."
  },
  {
    slug: "attention",
    title: "Attention Mechanisms",
    description: "Efficient attention implementations for faster inference",
    icon: "⚡",
    seoContent: "Attention computation dominates LLM inference time, especially for long sequences. Optimized attention mechanisms like Flash Attention 2 and Paged Attention can deliver 2-4x speedups by using memory-efficient algorithms and GPU-optimized kernels. These techniques reduce memory bandwidth bottlenecks and enable longer context windows without proportionally increasing latency."
  },
  {
    slug: "kv-cache",
    title: "KV-Cache Optimization",
    description: "Techniques to reduce memory footprint of key-value caches",
    icon: "💾",
    seoContent: "KV-cache stores attention keys and values from previous tokens, growing linearly with sequence length and batch size. For long-context applications, KV-cache can consume more VRAM than the model weights themselves. Techniques like Multi-Query Attention, Grouped-Query Attention, and KV-cache quantization dramatically reduce this overhead while maintaining generation quality."
  },
  {
    slug: "batching",
    title: "Batching Strategies",
    description: "Maximize throughput with intelligent request batching",
    icon: "📦",
    seoContent: "Smart batching is key to maximizing GPU utilization in production LLM deployments. Continuous batching dynamically adds and removes requests mid-generation, eliminating idle time. Chunked prefill prevents long prompts from blocking other requests. These techniques can increase throughput by 10-20x compared to naive static batching."
  },
  {
    slug: "memory",
    title: "Memory Management",
    description: "Distribute and offload model weights across devices",
    icon: "🧠",
    seoContent: "Large models often exceed single-GPU memory capacity. Tensor parallelism splits model layers across multiple GPUs for faster inference. Pipeline parallelism enables serving on smaller GPUs by processing layers sequentially. CPU offloading lets you run models larger than your total GPU VRAM by streaming weights on-demand."
  },
  {
    slug: "frameworks",
    title: "Inference Frameworks",
    description: "Production-ready frameworks for LLM deployment",
    icon: "🛠️",
    seoContent: "Production LLM deployment requires more than just loading a model. Inference frameworks like vLLM, TensorRT-LLM, and Text Generation Inference bundle optimizations into easy-to-deploy packages. They handle continuous batching, quantization, distributed inference, and API serving out of the box, letting you focus on your application instead of infrastructure."
  }
]

export function getCategoryBySlug(slug: string): CategoryMeta | undefined {
  return CATEGORIES.find(c => c.slug === slug)
}
