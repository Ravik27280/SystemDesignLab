import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Problem, Design, Theme, FlowNode, FlowEdge } from '../types';

interface AppState {
    // Theme
    theme: Theme;
    toggleTheme: () => void;

    // Authentication
    token: string | null;
    setToken: (token: string | null) => void;
    clearToken: () => void;
    logout: () => void;

    // User
    user: User | null;
    setUser: (user: User | null) => void;

    // Problems
    problems: Problem[];
    setProblems: (problems: Problem[]) => void;

    // Designs
    designs: Design[];
    setDesigns: (designs: Design[]) => void;
    addDesign: (design: Design) => void;
    updateDesign: (id: string, design: Partial<Design>) => void;
    deleteDesign: (id: string) => void;

    // Current workspace
    currentProblem: Problem | null;
    setCurrentProblem: (problem: Problem | null) => void;

    // Architecture canvas
    nodes: FlowNode[];
    edges: FlowEdge[];
    setNodes: (nodes: FlowNode[]) => void;
    setEdges: (edges: FlowEdge[]) => void;

    // Selected node for configuration panel
    selectedNode: FlowNode | null;
    setSelectedNode: (node: FlowNode | null) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            // Theme
            theme: 'dark',
            toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

            // Authentication
            token: null,
            setToken: (token) => set({ token }),
            clearToken: () => {
                localStorage.removeItem('token');
                set({ token: null });
            },
            logout: () => {
                localStorage.removeItem('token');
                set({ token: null, user: null, designs: [], problems: [] });
            },

            // User
            user: null,
            setUser: (user) => set({ user }),

            // Problems
            problems: [],
            setProblems: (problems) => set({ problems }),

            // Designs
            designs: [],
            setDesigns: (designs) => set({ designs }),
            addDesign: (design) => set((state) => ({ designs: [...state.designs, design] })),
            updateDesign: (id, updatedDesign) =>
                set((state) => ({
                    designs: state.designs.map((d) => (d.id === id ? { ...d, ...updatedDesign } : d)),
                })),
            deleteDesign: (id) => set((state) => ({ designs: state.designs.filter((d) => d.id !== id) })),

            // Current workspace
            currentProblem: null,
            setCurrentProblem: (problem) => set({ currentProblem: problem }),

            // Architecture canvas
            nodes: [],
            edges: [],
            setNodes: (nodes) => set({ nodes }),
            setEdges: (edges) => set({ edges }),

            // Selected node
            selectedNode: null,
            setSelectedNode: (node) => set({ selectedNode: node }),
        }),
        {
            name: 'systemdesignlab-storage',
            partialize: (state) => ({
                theme: state.theme,
                user: state.user,
                designs: state.designs,
                currentProblem: state.currentProblem,
                problems: state.problems,
            }),
        }
    )
);
