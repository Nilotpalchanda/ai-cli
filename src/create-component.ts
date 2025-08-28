import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { ConsoleLogger } from './utils/logger';

const logger = new ConsoleLogger();

export interface ComponentOptions {
  names: string[];
  projectPath: string;
}

export async function createComponents(options: ComponentOptions): Promise<void> {
  const { names, projectPath } = options;
  
  // Validate that we have at least one component name
  if (!names || names.length === 0) {
    throw new Error('At least one component name is required');
  }

  // Check if it's a Next.js project once
  const packageJsonPath = path.join(projectPath, 'package.json');
  if (!await fs.pathExists(packageJsonPath)) {
    throw new Error('No package.json found. Please run this command in a Next.js project directory.');
  }

  const packageJson = await fs.readJson(packageJsonPath);
  const isNextProject = packageJson.dependencies?.next || packageJson.devDependencies?.next;
  
  if (!isNextProject) {
    throw new Error('This command should be run in a Next.js project.');
  }

  // Create components directory if it doesn't exist
  const componentsDir = path.join(projectPath, 'components');
  await fs.ensureDir(componentsDir);
  logger.info(`📁 Components directory: ${componentsDir}`);

  // Create each component
  const createdComponents: string[] = [];
  const skippedComponents: string[] = [];

  for (const name of names) {
    try {
      await createSingleComponent(name.trim(), componentsDir);
      createdComponents.push(name.trim());
    } catch (error) {
      logger.warn(`⚠️ Skipped ${name.trim()}: ${error instanceof Error ? error.message : String(error)}`);
      skippedComponents.push(name.trim());
    }
  }

  // Summary
  if (createdComponents.length > 0) {
    logger.success(`✅ Created ${createdComponents.length} component(s): ${createdComponents.join(', ')}`);
  }
  
  if (skippedComponents.length > 0) {
    logger.warn(`⚠️ Skipped ${skippedComponents.length} component(s): ${skippedComponents.join(', ')}`);
  }
}

async function createSingleComponent(name: string, componentsDir: string): Promise<void> {
  // Validate component name
  if (!name || name.trim().length === 0) {
    throw new Error('Component name is required');
  }

  // Convert component name to proper format (kebab-case)
  const componentFileName = `${name.toLowerCase().replace(/\s+/g, '-')}-component.tsx`;
  const componentName = name
    .split(/[\s-_]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');

  // Create component file path
  const componentFilePath = path.join(componentsDir, componentFileName);
  
  // Check if component already exists
  if (await fs.pathExists(componentFilePath)) {
    throw new Error(`Component ${componentFileName} already exists`);
  }

  // Generate component content based on type
  const componentContent = generateShadcnComponent(name.toLowerCase(), componentName);

  // Write component file
  await fs.writeFile(componentFilePath, componentContent, 'utf8');
  
  logger.info(`✅ Created component: ${chalk.green(componentFileName)}`);
  logger.info(`📍 Location: ${chalk.cyan(componentFilePath)}`);
}

function generateShadcnComponent(componentType: string, componentName: string): string {
  // Detect component type and generate appropriate Shadcn template
  if (componentType.includes('button')) {
    return generateButtonTemplate(componentName);
  } else if (componentType.includes('card')) {
    return generateCardTemplate(componentName);
  } else if (componentType.includes('input')) {
    return generateInputTemplate(componentName);
  } else if (componentType.includes('dialog') || componentType.includes('modal')) {
    return generateDialogTemplate(componentName);
  } else if (componentType.includes('badge')) {
    return generateBadgeTemplate(componentName);
  } else if (componentType.includes('alert')) {
    return generateAlertTemplate(componentName);
  } else if (componentType.includes('avatar')) {
    return generateAvatarTemplate(componentName);
  } else if (componentType.includes('checkbox')) {
    return generateCheckboxTemplate(componentName);
  } else if (componentType.includes('select')) {
    return generateSelectTemplate(componentName);
  } else if (componentType.includes('textarea')) {
    return generateTextareaTemplate(componentName);
  } else if (componentType.includes('switch')) {
    return generateSwitchTemplate(componentName);
  } else if (componentType.includes('slider')) {
    return generateSliderTemplate(componentName);
  } else if (componentType.includes('progress')) {
    return generateProgressTemplate(componentName);
  } else if (componentType.includes('separator')) {
    return generateSeparatorTemplate(componentName);
  } else if (componentType.includes('skeleton')) {
    return generateSkeletonTemplate(componentName);
  } else if (componentType.includes('toast')) {
    return generateToastTemplate(componentName);
  } else if (componentType.includes('tooltip')) {
    return generateTooltipTemplate(componentName);
  } else {
    return generateGenericTemplate(componentName);
  }
}

function generateButtonTemplate(componentName: string): string {
  return `import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ${componentName}Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const ${componentName} = React.forwardRef<HTMLButtonElement, ${componentName}Props>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
${componentName}.displayName = "${componentName}"

export { ${componentName}, buttonVariants }
`;
}

// Template functions for different component types
function generateCardTemplate(componentName: string): string {
  return `import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
)
CardHeader.displayName = "CardHeader"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
)
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardContent }
`;
}

function generateInputTemplate(componentName: string): string {
  return `import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const ${componentName} = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
${componentName}.displayName = "${componentName}"

export { ${componentName} }
`;
}

function generateDialogTemplate(componentName: string): string {
  return `import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70">
        <X className="h-4 w-4" />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

export { Dialog, DialogTrigger, DialogContent }
`;
}

function generateBadgeTemplate(componentName: string): string {
  return `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function ${componentName}({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { ${componentName}, badgeVariants }
`;
}

function generateAlertTemplate(componentName: string): string {
  return `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

export { Alert }
`;
}

// Simplified templates for other components
function generateAvatarTemplate(componentName: string): string {
  return generateGenericTemplate(componentName);
}

function generateCheckboxTemplate(componentName: string): string {
  return generateGenericTemplate(componentName);
}

function generateSelectTemplate(componentName: string): string {
  return generateGenericTemplate(componentName);
}

function generateTextareaTemplate(componentName: string): string {
  return generateGenericTemplate(componentName);
}

function generateSwitchTemplate(componentName: string): string {
  return generateGenericTemplate(componentName);
}

function generateSliderTemplate(componentName: string): string {
  return generateGenericTemplate(componentName);
}

function generateProgressTemplate(componentName: string): string {
  return generateGenericTemplate(componentName);
}

function generateSeparatorTemplate(componentName: string): string {
  return generateGenericTemplate(componentName);
}

function generateSkeletonTemplate(componentName: string): string {
  return generateGenericTemplate(componentName);
}

function generateToastTemplate(componentName: string): string {
  return generateGenericTemplate(componentName);
}

function generateTooltipTemplate(componentName: string): string {
  return generateGenericTemplate(componentName);
}

function generateGenericTemplate(componentName: string): string {
  return `import * as React from "react"
import { cn } from "@/lib/utils"

export interface ${componentName}Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

const ${componentName} = React.forwardRef<HTMLDivElement, ${componentName}Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border bg-card text-card-foreground shadow-sm",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
${componentName}.displayName = "${componentName}"

export { ${componentName} }
`;
}
