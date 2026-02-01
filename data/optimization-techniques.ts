import { Category } from './optimization-categories'

export interface Technique {
  slug: string
  title: string
  category: Category
  summary: string
  description: string
  metrics?: {
    vramReduction?: string
    speedup?: string
    qualityRetention?: string
  }
  hardware: string[]
  frameworks: string[]
  codeExamples?: {
    title: string
    language: string
    code: string
  }[]
  references: {
    title: string
    url: string
    type: "paper" | "repo" | "docs"
  }[]
  relatedTechniques: string[]
  useWhen?: string[]
  skipWhen?: string[]
}

export const TECHNIQUES: Technique[] = [
  // === QUANTIZATION ===
  {
    slug: "gptq",
    title: "GPTQ",
    category: "quantization",
    summary: "Post-training quantization using approximate second-order information. Enables 4-bit inference with minimal quality loss.",
    description: `GPTQ (Generative Pre-trained Transformer Quantization) is a one-shot weight quantization method based on approximate second-order information. It quantizes weights to 3-4 bits while maintaining accuracy close to the full-precision model.

## How It Works

GPTQ quantizes weights layer-by-layer using the inverse Hessian matrix to determine optimal quantization. It processes layers in order, updating remaining weights to compensate for quantization error.

## Key Benefits

- **Memory Reduction**: 4-bit weights reduce model size by ~75% compared to FP16
- **Speed**: Faster inference due to reduced memory bandwidth
- **Quality**: Maintains perplexity close to FP16 baseline`,
    metrics: {
      vramReduction: "~75% vs FP16",
      speedup: "1.5-3x (memory-bound)",
      qualityRetention: "<1% perplexity increase"
    },
    hardware: ["nvidia", "amd"],
    frameworks: ["vllm", "transformers", "exllama"],
    codeExamples: [
      {
        title: "Load GPTQ model with vLLM",
        language: "python",
        code: `from vllm import LLM

model = LLM(
    model="TheBloke/Llama-2-7B-GPTQ",
    quantization="gptq",
    dtype="float16"
)`
      }
    ],
    references: [
      { title: "GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers", url: "https://arxiv.org/abs/2210.17323", type: "paper" },
      { title: "AutoGPTQ GitHub", url: "https://github.com/AutoGPTQ/AutoGPTQ", type: "repo" }
    ],
    relatedTechniques: ["awq", "gguf", "bitsandbytes"],
    useWhen: ["Running on NVIDIA GPUs", "Need 4-bit quantization", "Using vLLM or ExLlama"],
    skipWhen: ["Need CPU inference", "Model not available in GPTQ format"]
  },
  {
    slug: "awq",
    title: "AWQ",
    category: "quantization",
    summary: "Activation-aware weight quantization that protects salient weights. Often faster than GPTQ with similar quality.",
    description: `AWQ (Activation-aware Weight Quantization) observes activation patterns during calibration to identify and protect important weights. It achieves 4-bit quantization with better inference speed than GPTQ.

## How It Works

AWQ identifies salient weight channels by analyzing activation magnitudes during calibration. Important weights are scaled to reduce quantization error, then the model is quantized to 4 bits.

## Key Benefits

- **Speed**: Typically faster than GPTQ due to simpler dequantization
- **Quality**: Comparable or better than GPTQ for most models
- **Compatibility**: Wide framework support`,
    metrics: {
      vramReduction: "~75% vs FP16",
      speedup: "1.5-4x (vs FP16)"
    },
    hardware: ["nvidia", "amd"],
    frameworks: ["vllm", "transformers", "tensorrt-llm"],
    codeExamples: [
      {
        title: "Load AWQ model with vLLM",
        language: "python",
        code: `from vllm import LLM

model = LLM(
    model="TheBloke/Llama-2-7B-AWQ",
    quantization="awq"
)`
      }
    ],
    references: [
      { title: "AWQ: Activation-aware Weight Quantization", url: "https://arxiv.org/abs/2306.00978", type: "paper" },
      { title: "llm-awq GitHub", url: "https://github.com/mit-han-lab/llm-awq", type: "repo" }
    ],
    relatedTechniques: ["gptq", "gguf"],
    useWhen: ["Need fast 4-bit inference on NVIDIA", "Using vLLM or TensorRT-LLM"],
    skipWhen: ["Need CPU inference", "Running on Apple Silicon"]
  },
  {
    slug: "gguf",
    title: "GGUF / llama.cpp Quantization",
    category: "quantization",
    summary: "CPU-optimized quantization format with various precision options (Q4, Q5, Q6, Q8). Works on any hardware.",
    description: `GGUF is the successor to GGML, providing a flexible file format for quantized models optimized for llama.cpp. Supports multiple quantization levels from 2-bit to 8-bit.

## Quantization Levels

- **Q2_K, Q3_K**: Extreme compression, noticeable quality loss
- **Q4_K_M**: Good balance of size and quality (recommended)
- **Q5_K_M**: Higher quality, larger size
- **Q6_K, Q8_0**: Near-original quality

## Key Benefits

- **Universal**: Works on CPU, NVIDIA, AMD, Apple Silicon
- **Flexible**: Choose quality/size tradeoff
- **No GPU Required**: Full CPU inference support`,
    metrics: {
      vramReduction: "50-87% depending on quant level"
    },
    hardware: ["nvidia", "amd", "apple", "cpu"],
    frameworks: ["llama.cpp", "ollama", "text-generation-webui"],
    codeExamples: [
      {
        title: "Run GGUF with llama.cpp",
        language: "bash",
        code: `./llama-cli -m llama-2-7b.Q4_K_M.gguf \\
  -p "Hello, world" \\
  -n 128 --ctx-size 4096`
      }
    ],
    references: [
      { title: "llama.cpp GitHub", url: "https://github.com/ggerganov/llama.cpp", type: "repo" },
      { title: "GGUF specification", url: "https://github.com/ggerganov/ggml/blob/master/docs/gguf.md", type: "docs" }
    ],
    relatedTechniques: ["gptq", "awq"],
    useWhen: ["Running on CPU", "Need Apple Silicon support", "Using Ollama or llama.cpp"],
    skipWhen: ["Need maximum GPU throughput", "Using vLLM in production"]
  },
  {
    slug: "bitsandbytes",
    title: "bitsandbytes (QLoRA)",
    category: "quantization",
    summary: "Dynamic quantization for training and inference. Enables 4-bit QLoRA fine-tuning on consumer GPUs.",
    description: `bitsandbytes provides 8-bit and 4-bit quantization for PyTorch models. Most notably used for QLoRA training, allowing fine-tuning of large models on consumer hardware.

## Features

- **8-bit Optimizers**: Reduce optimizer memory by 75%
- **4-bit NormalFloat (NF4)**: Optimal 4-bit data type for normally-distributed weights
- **Double Quantization**: Further memory reduction for QLoRA

## Key Benefits

- **Training Support**: Only method enabling 4-bit fine-tuning
- **Easy Integration**: Works with HuggingFace Transformers
- **Dynamic Quantization**: No pre-quantized model needed`,
    metrics: {
      vramReduction: "~75% with 4-bit"
    },
    hardware: ["nvidia"],
    frameworks: ["transformers", "peft"],
    codeExamples: [
      {
        title: "Load 4-bit model with bitsandbytes",
        language: "python",
        code: `from transformers import AutoModelForCausalLM, BitsAndBytesConfig

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype="float16"
)

model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-2-7b-hf",
    quantization_config=bnb_config
)`
      }
    ],
    references: [
      { title: "QLoRA: Efficient Finetuning of Quantized LLMs", url: "https://arxiv.org/abs/2305.14314", type: "paper" },
      { title: "bitsandbytes GitHub", url: "https://github.com/TimDettmers/bitsandbytes", type: "repo" }
    ],
    relatedTechniques: ["gptq", "awq"],
    useWhen: ["Fine-tuning with limited VRAM", "Quick inference testing", "Using HuggingFace ecosystem"],
    skipWhen: ["Production inference (use GPTQ/AWQ)", "Non-NVIDIA hardware"]
  },
  {
    slug: "fp8",
    title: "FP8 Quantization",
    category: "quantization",
    summary: "8-bit floating point format with hardware acceleration on Hopper/Ada GPUs. Near-FP16 quality with 2x throughput.",
    description: `FP8 (8-bit floating point) is a hardware-accelerated quantization format supported on NVIDIA Hopper (H100) and Ada Lovelace (RTX 40xx) GPUs. It provides significant speedup with minimal quality loss.

## Formats

- **E4M3**: 4-bit exponent, 3-bit mantissa (higher precision, recommended for weights)
- **E5M2**: 5-bit exponent, 2-bit mantissa (larger range, for activations)

## Key Benefits

- **Hardware Acceleration**: Native Tensor Core support
- **Quality**: Much better than INT8 for LLMs
- **Performance**: ~2x throughput vs FP16`,
    metrics: {
      vramReduction: "~50% vs FP16",
      speedup: "~2x on Hopper/Ada"
    },
    hardware: ["nvidia"],
    frameworks: ["vllm", "tensorrt-llm"],
    codeExamples: [
      {
        title: "Enable FP8 in vLLM",
        language: "python",
        code: `from vllm import LLM

model = LLM(
    model="meta-llama/Llama-2-7b-hf",
    quantization="fp8"
)  # Requires H100/RTX 40xx`
      }
    ],
    references: [
      { title: "FP8 Formats for Deep Learning", url: "https://arxiv.org/abs/2209.05433", type: "paper" },
      { title: "vLLM FP8 Documentation", url: "https://docs.vllm.ai/en/latest/quantization/fp8.html", type: "docs" }
    ],
    relatedTechniques: ["awq", "gptq"],
    useWhen: ["Have H100 or RTX 40xx GPUs", "Need near-FP16 quality", "Maximum throughput required"],
    skipWhen: ["Older GPU architecture", "Need 4-bit compression"]
  },

  // === ATTENTION ===
  {
    slug: "flash-attention-2",
    title: "Flash Attention 2",
    category: "attention",
    summary: "Memory-efficient attention with IO-aware tiling. 2-4x faster than standard attention, O(1) memory overhead.",
    description: `Flash Attention 2 is an IO-aware exact attention algorithm that reduces memory reads/writes by tiling the computation. It's the de-facto standard for efficient transformer inference.

## How It Works

Instead of materializing the full attention matrix (O(n²) memory), Flash Attention computes attention in tiles that fit in SRAM, writing only the final output to HBM.

## Key Benefits

- **Memory**: O(n) instead of O(n²) for attention
- **Speed**: 2-4x faster than standard attention
- **Exact**: No approximation, identical outputs`,
    metrics: {
      speedup: "2-4x vs standard attention"
    },
    hardware: ["nvidia", "amd"],
    frameworks: ["vllm", "transformers", "tensorrt-llm"],
    codeExamples: [
      {
        title: "Enable Flash Attention in Transformers",
        language: "python",
        code: `from transformers import AutoModelForCausalLM

model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-2-7b-hf",
    attn_implementation="flash_attention_2",
    torch_dtype="float16"
)`
      }
    ],
    references: [
      { title: "FlashAttention-2: Faster Attention with Better Parallelism", url: "https://arxiv.org/abs/2307.08691", type: "paper" },
      { title: "flash-attention GitHub", url: "https://github.com/Dao-AILab/flash-attention", type: "repo" }
    ],
    relatedTechniques: ["paged-attention", "mqa", "gqa"],
    useWhen: ["Any transformer inference", "Long context lengths", "Using modern frameworks"],
    skipWhen: ["CPU-only inference", "Very old GPU (pre-Ampere)"]
  },
  {
    slug: "paged-attention",
    title: "Paged Attention",
    category: "attention",
    summary: "Virtual memory for KV-cache. Enables efficient batching and eliminates memory fragmentation. Core innovation in vLLM.",
    description: `Paged Attention manages KV-cache memory like an operating system manages virtual memory. It eliminates fragmentation and enables efficient memory sharing across requests.

## How It Works

Instead of contiguous KV-cache allocation, Paged Attention stores cache in fixed-size blocks. A block table maps logical cache positions to physical memory, enabling:

- **No Fragmentation**: Only allocate what's needed
- **Memory Sharing**: Reuse blocks for common prefixes
- **Dynamic Allocation**: Grow cache as generation proceeds

## Key Benefits

- **Throughput**: 2-4x higher batch sizes
- **Efficiency**: Near-zero memory waste
- **Flexibility**: Variable sequence lengths`,
    metrics: {
      speedup: "2-4x throughput vs naive batching"
    },
    hardware: ["nvidia", "amd"],
    frameworks: ["vllm", "tensorrt-llm", "sglang"],
    codeExamples: [
      {
        title: "vLLM uses Paged Attention by default",
        language: "python",
        code: `from vllm import LLM, SamplingParams

llm = LLM(model="meta-llama/Llama-2-7b-hf")
# Paged Attention enabled automatically

outputs = llm.generate(
    ["Hello, ", "How are "],
    SamplingParams(max_tokens=100)
)`
      }
    ],
    references: [
      { title: "Efficient Memory Management for LLM Serving with PagedAttention", url: "https://arxiv.org/abs/2309.06180", type: "paper" },
      { title: "vLLM GitHub", url: "https://github.com/vllm-project/vllm", type: "repo" }
    ],
    relatedTechniques: ["flash-attention-2", "continuous-batching"],
    useWhen: ["High-throughput serving", "Variable-length batches", "Using vLLM"],
    skipWhen: ["Single request at a time", "Not using vLLM-based serving"]
  },
  {
    slug: "mqa",
    title: "Multi-Query Attention (MQA)",
    category: "attention",
    summary: "Single KV head shared across all query heads. Reduces KV-cache by 8-32x. Used in Falcon, PaLM.",
    description: `Multi-Query Attention uses a single key-value head shared across all query heads. This dramatically reduces KV-cache memory and improves inference speed.

## How It Works

Standard multi-head attention: each head has its own Q, K, V projections.
MQA: each head has its own Q, but all heads share K and V.

## Architecture Impact

For a model with 32 attention heads:
- **MHA**: 32 KV heads → 32x cache
- **MQA**: 1 KV head → 1x cache

## Key Benefits

- **Memory**: 8-32x smaller KV-cache
- **Speed**: Faster attention due to smaller cache
- **Tradeoff**: Slight quality decrease`,
    metrics: {
      vramReduction: "8-32x smaller KV-cache"
    },
    hardware: ["nvidia", "amd", "apple", "cpu"],
    frameworks: ["vllm", "transformers", "llama.cpp"],
    references: [
      { title: "Fast Transformer Decoding: One Write-Head is All You Need", url: "https://arxiv.org/abs/1911.02150", type: "paper" }
    ],
    relatedTechniques: ["gqa", "flash-attention-2"],
    useWhen: ["Long context inference", "Memory-constrained deployment"],
    skipWhen: ["Using pre-existing MHA model (architecture is fixed at training)"]
  },
  {
    slug: "gqa",
    title: "Grouped-Query Attention (GQA)",
    category: "attention",
    summary: "Compromise between MHA and MQA. Groups of query heads share KV heads. Used in Llama 2 70B, Mistral.",
    description: `Grouped-Query Attention divides query heads into groups, with each group sharing a single KV head. It balances MHA quality with MQA efficiency.

## How It Works

For 32 query heads with 8 groups:
- 4 query heads share each KV head
- Total: 8 KV heads instead of 32

## Key Benefits

- **Quality**: Better than MQA, close to MHA
- **Efficiency**: 4-8x smaller KV-cache than MHA
- **Adoption**: Standard in modern LLMs`,
    metrics: {
      vramReduction: "4-8x smaller KV-cache vs MHA"
    },
    hardware: ["nvidia", "amd", "apple", "cpu"],
    frameworks: ["vllm", "transformers", "llama.cpp", "tensorrt-llm"],
    references: [
      { title: "GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints", url: "https://arxiv.org/abs/2305.13245", type: "paper" }
    ],
    relatedTechniques: ["mqa", "flash-attention-2"],
    useWhen: ["Models already use GQA (Llama 2 70B, Mistral)"],
    skipWhen: ["Architecture is fixed at training time"]
  },

  // === KV-CACHE ===
  {
    slug: "kv-cache-quantization",
    title: "KV-Cache Quantization",
    category: "kv-cache",
    summary: "Quantize cached keys/values to FP8 or INT8. Reduces KV memory by 50% with minimal quality impact.",
    description: `KV-cache quantization reduces the memory footprint of cached key-value pairs by storing them in lower precision formats.

## Formats

- **FP8**: Recommended, minimal quality loss
- **INT8**: More compression, slightly more quality loss

## Key Benefits

- **Memory**: 50% reduction in KV-cache
- **Throughput**: Larger batches possible
- **Quality**: <1% impact on most benchmarks`,
    metrics: {
      vramReduction: "~50% for KV-cache"
    },
    hardware: ["nvidia"],
    frameworks: ["vllm", "tensorrt-llm"],
    codeExamples: [
      {
        title: "Enable KV-cache quantization in vLLM",
        language: "python",
        code: `from vllm import LLM

model = LLM(
    model="meta-llama/Llama-2-7b-hf",
    kv_cache_dtype="fp8"  # or "int8"
)`
      }
    ],
    references: [
      { title: "vLLM KV Cache Documentation", url: "https://docs.vllm.ai/en/latest/quantization/fp8_kv_cache.html", type: "docs" }
    ],
    relatedTechniques: ["fp8", "prefix-caching"],
    useWhen: ["Long context inference", "Memory-limited deployment", "Using vLLM"],
    skipWhen: ["Maximum quality required", "Very short contexts"]
  },
  {
    slug: "prefix-caching",
    title: "Prefix Caching",
    category: "kv-cache",
    summary: "Cache and reuse KV-cache for shared prompt prefixes. Eliminates redundant computation for repeated context.",
    description: `Prefix caching stores the KV-cache for common prompt prefixes and reuses it across requests. This is particularly effective for RAG and system prompts.

## Use Cases

- **System Prompts**: Cache the system message
- **RAG**: Cache retrieved documents
- **Few-shot**: Cache example prompts

## Key Benefits

- **Latency**: Skip recomputing prefix
- **Throughput**: More capacity for unique content
- **Cost**: Reduce compute per request`,
    metrics: {
      speedup: "2-10x for repeated prefixes"
    },
    hardware: ["nvidia", "amd"],
    frameworks: ["vllm", "tensorrt-llm", "sglang"],
    codeExamples: [
      {
        title: "Enable prefix caching in vLLM",
        language: "python",
        code: `from vllm import LLM

model = LLM(
    model="meta-llama/Llama-2-7b-hf",
    enable_prefix_caching=True
)`
      }
    ],
    references: [
      { title: "vLLM Automatic Prefix Caching", url: "https://docs.vllm.ai/en/latest/automatic_prefix_caching/apc.html", type: "docs" },
      { title: "SGLang RadixAttention", url: "https://arxiv.org/abs/2312.07104", type: "paper" }
    ],
    relatedTechniques: ["kv-cache-quantization", "continuous-batching"],
    useWhen: ["RAG pipelines", "Shared system prompts", "Multi-turn conversations"],
    skipWhen: ["Every request has unique context", "Single-turn inference"]
  },
  {
    slug: "sliding-window-attention",
    title: "Sliding Window Attention",
    category: "kv-cache",
    summary: "Limit attention to recent tokens only. Enables infinite context with fixed memory. Used in Mistral.",
    description: `Sliding Window Attention restricts each token to attend only to the previous W tokens, where W is the window size. This bounds KV-cache memory regardless of sequence length.

## How It Works

- Each layer attends to window of W tokens
- With L layers and window W, effective context is L × W
- Mistral: W=4096, L=32 → effective 128K context

## Key Benefits

- **Memory**: Fixed KV-cache size
- **Infinite Context**: No memory limit on sequence length
- **Speed**: Faster attention for long sequences`,
    metrics: {
      vramReduction: "Bounded regardless of context length"
    },
    hardware: ["nvidia", "amd", "apple", "cpu"],
    frameworks: ["vllm", "transformers", "llama.cpp"],
    references: [
      { title: "Mistral 7B Paper", url: "https://arxiv.org/abs/2310.06825", type: "paper" },
      { title: "Longformer: The Long-Document Transformer", url: "https://arxiv.org/abs/2004.05150", type: "paper" }
    ],
    relatedTechniques: ["flash-attention-2", "kv-cache-quantization"],
    useWhen: ["Model uses sliding window (Mistral)"],
    skipWhen: ["Architecture is fixed at training time"]
  },

  // === BATCHING ===
  {
    slug: "continuous-batching",
    title: "Continuous Batching",
    category: "batching",
    summary: "Dynamic batching that adds/removes requests as they complete. Maximizes GPU utilization.",
    description: `Continuous batching (also called in-flight batching) dynamically adjusts the batch as requests complete, rather than waiting for all requests to finish.

## Traditional vs Continuous

**Static Batching**: Wait for all requests to complete, then start next batch. GPU idles while waiting for slowest request.

**Continuous Batching**: As each request finishes, immediately add a new one. GPU stays saturated.

## Key Benefits

- **Utilization**: Near-100% GPU usage
- **Latency**: No waiting for batch completion
- **Throughput**: 10-20x improvement possible`,
    metrics: {
      speedup: "10-20x throughput vs static batching"
    },
    hardware: ["nvidia", "amd"],
    frameworks: ["vllm", "tensorrt-llm", "sglang", "text-generation-inference"],
    codeExamples: [
      {
        title: "vLLM server uses continuous batching",
        language: "bash",
        code: `# Start vLLM server (continuous batching is default)
python -m vllm.entrypoints.openai.api_server \\
    --model meta-llama/Llama-2-7b-hf \\
    --port 8000`
      }
    ],
    references: [
      { title: "Orca: A Distributed Serving System for Transformer-Based LLMs", url: "https://www.usenix.org/conference/osdi22/presentation/yu", type: "paper" },
      { title: "vLLM GitHub", url: "https://github.com/vllm-project/vllm", type: "repo" }
    ],
    relatedTechniques: ["paged-attention", "speculative-decoding", "chunked-prefill"],
    useWhen: ["Production serving", "Variable-length requests", "High throughput needed"],
    skipWhen: ["Single request inference", "Batch inference with same lengths"]
  },
  {
    slug: "speculative-decoding",
    title: "Speculative Decoding",
    category: "batching",
    summary: "Use small draft model to predict tokens, verify with large model. 2-3x faster with identical outputs.",
    description: `Speculative decoding uses a small, fast model to generate draft tokens, then verifies them with the large model in a single forward pass. Accepted tokens are free; rejected ones are regenerated.

## How It Works

1. Draft model generates K tokens quickly
2. Target model verifies all K tokens in one pass
3. Accept matching tokens, regenerate from first mismatch
4. Repeat

## Key Benefits

- **Speed**: 2-3x faster generation
- **Quality**: Mathematically identical outputs
- **Memory**: Small draft model overhead`,
    metrics: {
      speedup: "2-3x for autoregressive generation"
    },
    hardware: ["nvidia", "amd"],
    frameworks: ["vllm", "transformers", "tensorrt-llm"],
    codeExamples: [
      {
        title: "Speculative decoding with vLLM",
        language: "python",
        code: `from vllm import LLM

model = LLM(
    model="meta-llama/Llama-2-70b-hf",
    speculative_model="meta-llama/Llama-2-7b-hf",
    num_speculative_tokens=5
)`
      }
    ],
    references: [
      { title: "Fast Inference from Transformers via Speculative Decoding", url: "https://arxiv.org/abs/2211.17192", type: "paper" },
      { title: "Accelerating LLM Inference with Staged Speculative Decoding", url: "https://arxiv.org/abs/2308.04623", type: "paper" }
    ],
    relatedTechniques: ["continuous-batching", "chunked-prefill"],
    useWhen: ["Latency-sensitive applications", "Large model inference", "Have VRAM for draft model"],
    skipWhen: ["Already memory-constrained", "High batch sizes (less benefit)"]
  },
  {
    slug: "chunked-prefill",
    title: "Chunked Prefill",
    category: "batching",
    summary: "Split long prompts into chunks and interleave with decode steps. Reduces latency for short requests in mixed workloads.",
    description: `Chunked Prefill breaks long prompt processing into smaller chunks, interleaving them with decode steps from other requests. This prevents long prompts from blocking short requests.

## How It Works

Instead of processing an entire prompt at once (which can take seconds for long contexts), the prefill is split into fixed-size chunks:

1. Process chunk of long prompt
2. Run decode steps for other requests
3. Process next chunk
4. Repeat

## Key Benefits

- **Fairness**: Short requests don't wait for long prompts
- **Latency**: More predictable response times
- **Throughput**: Better GPU utilization in mixed workloads`,
    metrics: {
      speedup: "2-5x latency reduction for short requests"
    },
    hardware: ["nvidia", "amd"],
    frameworks: ["vllm", "sglang"],
    codeExamples: [
      {
        title: "Enable chunked prefill in vLLM",
        language: "python",
        code: `from vllm import LLM

model = LLM(
    model="meta-llama/Llama-2-7b-hf",
    enable_chunked_prefill=True,
    max_num_batched_tokens=2048  # chunk size
)`
      }
    ],
    references: [
      { title: "Sarathi: Efficient LLM Inference by Piggybacking Decodes with Chunked Prefills", url: "https://arxiv.org/abs/2308.16369", type: "paper" },
      { title: "vLLM Chunked Prefill Documentation", url: "https://docs.vllm.ai/en/latest/models/performance.html", type: "docs" }
    ],
    relatedTechniques: ["continuous-batching", "speculative-decoding"],
    useWhen: ["Mixed long/short request workloads", "Latency-sensitive applications", "Using vLLM or SGLang"],
    skipWhen: ["Uniform request lengths", "Throughput-only optimization"]
  },

  // === MEMORY ===
  {
    slug: "tensor-parallelism",
    title: "Tensor Parallelism",
    category: "memory",
    summary: "Split layers across GPUs. Linear scaling for models too large for single GPU.",
    description: `Tensor Parallelism (TP) splits individual layers across multiple GPUs, allowing models larger than single-GPU memory to run.

## How It Works

- Weight matrices are split column-wise or row-wise
- Each GPU computes its partition
- Results are combined via all-reduce

## Key Benefits

- **Memory**: Linear reduction with GPU count
- **Latency**: Lower than pipeline parallelism
- **Utilization**: All GPUs active simultaneously`,
    metrics: {
      vramReduction: "Linear with GPU count (2 GPUs = 50% each)"
    },
    hardware: ["nvidia", "amd"],
    frameworks: ["vllm", "tensorrt-llm", "deepspeed"],
    codeExamples: [
      {
        title: "Enable tensor parallelism in vLLM",
        language: "python",
        code: `from vllm import LLM

# Llama 70B across 4 GPUs
model = LLM(
    model="meta-llama/Llama-2-70b-hf",
    tensor_parallel_size=4
)`
      }
    ],
    references: [
      { title: "Megatron-LM: Training Multi-Billion Parameter Language Models", url: "https://arxiv.org/abs/1909.08053", type: "paper" },
      { title: "vLLM Distributed Inference", url: "https://docs.vllm.ai/en/latest/serving/distributed_serving.html", type: "docs" }
    ],
    relatedTechniques: ["pipeline-parallelism", "cpu-offloading"],
    useWhen: ["Model doesn't fit in single GPU", "Have multiple GPUs with fast interconnect"],
    skipWhen: ["Model fits in one GPU", "GPUs have slow interconnect"]
  },
  {
    slug: "pipeline-parallelism",
    title: "Pipeline Parallelism",
    category: "memory",
    summary: "Split model by layers across GPUs. Better for slow interconnects than tensor parallelism.",
    description: `Pipeline Parallelism (PP) assigns different layers to different GPUs. Activations are passed sequentially between GPUs.

## How It Works

- Model split into stages by layer groups
- Each GPU holds consecutive layers
- Activations passed between GPUs sequentially

## Trade-offs

- **Pro**: Less communication than tensor parallelism
- **Con**: Pipeline bubbles reduce utilization
- **Best for**: Slow GPU interconnects`,
    hardware: ["nvidia", "amd"],
    frameworks: ["deepspeed", "megatron"],
    references: [
      { title: "GPipe: Efficient Training of Giant Neural Networks", url: "https://arxiv.org/abs/1811.06965", type: "paper" }
    ],
    relatedTechniques: ["tensor-parallelism"],
    useWhen: ["Slow GPU interconnect (PCIe)", "Very large models", "Training (less common for inference)"],
    skipWhen: ["Have NVLink/NVSwitch", "Can use tensor parallelism"]
  },
  {
    slug: "cpu-offloading",
    title: "CPU Offloading",
    category: "memory",
    summary: "Store weights in RAM, load to GPU layer-by-layer. Run large models on limited VRAM.",
    description: `CPU offloading stores model weights in system RAM and transfers them to GPU as needed for computation. This enables running models larger than GPU memory.

## How It Works

- Weights stored in pinned CPU memory
- Transferred to GPU layer-by-layer during inference
- Overlapped with computation when possible

## Trade-offs

- **Pro**: Run any model size with enough RAM
- **Con**: Significant speed reduction
- **Best for**: Testing, development, memory-constrained deployment`,
    hardware: ["nvidia", "amd", "apple"],
    frameworks: ["llama.cpp", "transformers", "exllama"],
    codeExamples: [
      {
        title: "CPU offloading with llama.cpp",
        language: "bash",
        code: `# Offload 20 layers to CPU
./llama-cli -m model.gguf \\
  --n-gpu-layers 12 \\  # Keep 12 on GPU
  -p "Hello"`
      }
    ],
    references: [
      { title: "llama.cpp GitHub", url: "https://github.com/ggerganov/llama.cpp", type: "repo" },
      { title: "DeepSpeed ZeRO-Offload", url: "https://arxiv.org/abs/2101.06840", type: "paper" }
    ],
    relatedTechniques: ["tensor-parallelism", "gguf"],
    useWhen: ["Model larger than VRAM", "Testing large models", "Non-production use"],
    skipWhen: ["Production latency requirements", "Have sufficient VRAM"]
  },

  // === FRAMEWORKS ===
  {
    slug: "vllm",
    title: "vLLM",
    category: "frameworks",
    summary: "High-throughput LLM serving with PagedAttention. De-facto standard for production inference.",
    description: `vLLM is a fast and easy-to-use library for LLM inference and serving. It pioneered PagedAttention and continuous batching for LLM serving.

## Features

- **PagedAttention**: Efficient KV-cache management
- **Continuous Batching**: Dynamic request handling
- **Quantization**: GPTQ, AWQ, FP8 support
- **Tensor Parallelism**: Multi-GPU inference
- **OpenAI-compatible API**: Drop-in replacement`,
    metrics: {
      speedup: "10-24x vs HuggingFace Transformers"
    },
    hardware: ["nvidia", "amd"],
    frameworks: ["vllm"],
    codeExamples: [
      {
        title: "Basic vLLM usage",
        language: "python",
        code: `from vllm import LLM, SamplingParams

llm = LLM(model="meta-llama/Llama-2-7b-hf")
outputs = llm.generate(
    ["Hello, my name is"],
    SamplingParams(temperature=0.8, max_tokens=100)
)
print(outputs[0].outputs[0].text)`
      },
      {
        title: "Start OpenAI-compatible server",
        language: "bash",
        code: `python -m vllm.entrypoints.openai.api_server \\
    --model meta-llama/Llama-2-7b-hf \\
    --port 8000`
      }
    ],
    references: [
      { title: "vLLM GitHub", url: "https://github.com/vllm-project/vllm", type: "repo" },
      { title: "vLLM Documentation", url: "https://docs.vllm.ai/", type: "docs" },
      { title: "PagedAttention Paper", url: "https://arxiv.org/abs/2309.06180", type: "paper" }
    ],
    relatedTechniques: ["paged-attention", "continuous-batching", "awq"],
    useWhen: ["Production LLM serving", "High throughput needed", "NVIDIA/AMD GPUs"],
    skipWhen: ["CPU-only deployment", "Apple Silicon"]
  },
  {
    slug: "tensorrt-llm",
    title: "TensorRT-LLM",
    category: "frameworks",
    summary: "NVIDIA's optimized LLM inference. Maximum performance on NVIDIA hardware.",
    description: `TensorRT-LLM is NVIDIA's library for optimizing and deploying LLMs. It compiles models to optimized TensorRT engines for maximum performance.

## Features

- **Graph Optimization**: Fused kernels, operator fusion
- **Quantization**: INT8, INT4, FP8 with calibration
- **Multi-GPU**: Tensor and pipeline parallelism
- **In-flight Batching**: Continuous batching support

## Trade-offs

- **Pro**: Maximum performance on NVIDIA
- **Con**: Longer setup, NVIDIA-only`,
    hardware: ["nvidia"],
    frameworks: ["tensorrt-llm"],
    codeExamples: [
      {
        title: "Build TensorRT-LLM engine",
        language: "bash",
        code: `# Convert and build optimized engine
python convert_checkpoint.py \\
    --model_dir ./llama-7b \\
    --output_dir ./trt_ckpt

trtllm-build \\
    --checkpoint_dir ./trt_ckpt \\
    --output_dir ./trt_engine \\
    --gemm_plugin float16`
      }
    ],
    references: [
      { title: "TensorRT-LLM GitHub", url: "https://github.com/NVIDIA/TensorRT-LLM", type: "repo" },
      { title: "TensorRT-LLM Documentation", url: "https://nvidia.github.io/TensorRT-LLM/", type: "docs" }
    ],
    relatedTechniques: ["vllm", "fp8"],
    useWhen: ["Maximum NVIDIA performance", "Production at scale", "Have engineering resources"],
    skipWhen: ["Quick prototyping", "Non-NVIDIA hardware", "Frequent model changes"]
  },
  {
    slug: "llama-cpp",
    title: "llama.cpp",
    category: "frameworks",
    summary: "CPU-first inference with GGUF format. Runs anywhere: CPU, NVIDIA, AMD, Apple Silicon.",
    description: `llama.cpp is a C++ implementation of LLM inference optimized for CPU and edge deployment. It supports multiple backends and quantization formats.

## Features

- **Universal**: CPU, CUDA, ROCm, Metal, Vulkan
- **GGUF Format**: Flexible quantization (Q2-Q8)
- **Low Memory**: Efficient for consumer hardware
- **CLI & Server**: Multiple interfaces

## Best For

- Local/edge deployment
- Consumer hardware
- Apple Silicon`,
    hardware: ["nvidia", "amd", "apple", "cpu"],
    frameworks: ["llama.cpp"],
    codeExamples: [
      {
        title: "Run inference with llama.cpp",
        language: "bash",
        code: `# Interactive mode
./llama-cli -m llama-2-7b.Q4_K_M.gguf \\
    -p "Hello" -n 100 -i

# Server mode
./llama-server -m model.gguf --port 8080`
      }
    ],
    references: [
      { title: "llama.cpp GitHub", url: "https://github.com/ggerganov/llama.cpp", type: "repo" }
    ],
    relatedTechniques: ["gguf", "cpu-offloading"],
    useWhen: ["Local deployment", "CPU inference", "Apple Silicon", "Edge devices"],
    skipWhen: ["Maximum GPU throughput", "Production serving at scale"]
  },
  {
    slug: "sglang",
    title: "SGLang",
    category: "frameworks",
    summary: "Fast serving with RadixAttention for prefix caching. Optimized for structured generation.",
    description: `SGLang is a structured generation language and serving framework. It features RadixAttention for efficient prefix caching and a programming model for complex LLM programs.

## Features

- **RadixAttention**: Radix tree-based prefix caching
- **Structured Generation**: Constrained decoding
- **High Performance**: Comparable to vLLM
- **Programming Model**: DSL for LLM workflows

## Best For

- RAG pipelines
- Structured outputs (JSON)
- Multi-turn conversations`,
    hardware: ["nvidia"],
    frameworks: ["sglang"],
    codeExamples: [
      {
        title: "SGLang structured generation",
        language: "python",
        code: `import sglang as sgl

@sgl.function
def json_gen(s):
    s += "Generate JSON: " + sgl.gen("json", regex=r'\\{.*\\}')`
      }
    ],
    references: [
      { title: "SGLang GitHub", url: "https://github.com/sgl-project/sglang", type: "repo" },
      { title: "SGLang Paper", url: "https://arxiv.org/abs/2312.07104", type: "paper" }
    ],
    relatedTechniques: ["prefix-caching", "continuous-batching"],
    useWhen: ["Structured outputs needed", "Heavy prefix reuse", "RAG applications"],
    skipWhen: ["Simple text generation", "Non-NVIDIA hardware"]
  }
]

export function getTechniquesByCategory(category: Category): Technique[] {
  return TECHNIQUES.filter(t => t.category === category)
}

export function getTechniqueBySlug(slug: string): Technique | undefined {
  return TECHNIQUES.find(t => t.slug === slug)
}

export function getRelatedTechniques(technique: Technique): Technique[] {
  return technique.relatedTechniques
    .map(slug => getTechniqueBySlug(slug))
    .filter((t): t is Technique => t !== undefined)
}
