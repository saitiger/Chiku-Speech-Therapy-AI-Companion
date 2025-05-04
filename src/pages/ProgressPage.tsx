
import React from 'react';
import { useScenario } from '@/context/ScenarioContext';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { scenarios } from '@/data/scenarios';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const ProgressPage: React.FC = () => {
  const { progressData } = useScenario();
  const navigate = useNavigate();
  
  // Transform data for chart
  const skillsData = Object.entries(progressData.scenarios).map(([id, data]) => {
    const scenario = scenarios.find(s => s.id === id) || { title: id };
    return {
      name: scenario.title,
      articulation: data.averageScores.articulation * 20,
      fluency: data.averageScores.fluency * 20,
      vocabulary: data.averageScores.vocabulary * 20,
      grammar: data.averageScores.grammar * 20,
      completions: data.completions
    };
  });
  
  // Calculate overall averages
  const calculateOverallAverage = (skill: keyof typeof progressData.scenarios[string]['averageScores']) => {
    const scenarios = Object.values(progressData.scenarios);
    if (scenarios.length === 0) return 0;
    
    const sum = scenarios.reduce((total, scenario) => total + scenario.averageScores[skill], 0);
    return Math.round((sum / scenarios.length) * 20);
  };
  
  const overallAverages = {
    articulation: calculateOverallAverage('articulation'),
    fluency: calculateOverallAverage('fluency'),
    vocabulary: calculateOverallAverage('vocabulary'),
    grammar: calculateOverallAverage('grammar'),
    communication: calculateOverallAverage('communication'),
    empathy: calculateOverallAverage('empathy'),
    cooperation: calculateOverallAverage('cooperation'),
    selfControl: calculateOverallAverage('selfControl')
  };
  
  // Check if we have any progress data
  const hasProgressData = Object.keys(progressData.scenarios).length > 0;
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-speech-light">
      <Header />
      <main className="flex-1 flex flex-col py-6 px-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="mb-4">
            <Button 
              variant="ghost" 
              className="flex items-center gap-2"
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </Button>
          </div>
          
          <div className="w-full mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-speech-dark mb-2">
              Progress Tracking
            </h1>
            <p className="text-speech-dark/80">
              Track improvement across speech and language skills
            </p>
          </div>
          
          {hasProgressData ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Overall Skills Progress */}
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Overall Skills Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Articulation</span>
                        <span className="text-sm">{overallAverages.articulation}%</span>
                      </div>
                      <Progress value={overallAverages.articulation} className="h-2 bg-speech-light" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Fluency</span>
                        <span className="text-sm">{overallAverages.fluency}%</span>
                      </div>
                      <Progress value={overallAverages.fluency} className="h-2 bg-speech-light" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Vocabulary</span>
                        <span className="text-sm">{overallAverages.vocabulary}%</span>
                      </div>
                      <Progress value={overallAverages.vocabulary} className="h-2 bg-speech-light" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Grammar</span>
                        <span className="text-sm">{overallAverages.grammar}%</span>
                      </div>
                      <Progress value={overallAverages.grammar} className="h-2 bg-speech-light" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Communication</span>
                        <span className="text-sm">{overallAverages.communication}%</span>
                      </div>
                      <Progress value={overallAverages.communication} className="h-2 bg-speech-light" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Empathy</span>
                        <span className="text-sm">{overallAverages.empathy}%</span>
                      </div>
                      <Progress value={overallAverages.empathy} className="h-2 bg-speech-light" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Activity Chart */}
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Activity Completion</CardTitle>
                </CardHeader>
                <CardContent>
                  {skillsData.length > 0 ? (
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={skillsData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="completions" fill="#8884d8" name="Completions" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <p className="text-center py-12 text-speech-dark/70">No activity data available yet.</p>
                  )}
                </CardContent>
              </Card>
              
              {/* Recent Activity */}
              <Card className="shadow-sm lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b">
                          <th className="pb-3 pr-4">Activity</th>
                          <th className="pb-3 pr-4">Completion Date</th>
                          <th className="pb-3 pr-4">Attempts</th>
                          <th className="pb-3">Average Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {Object.entries(progressData.scenarios)
                          .sort((a, b) => new Date(b[1].lastCompletedAt).getTime() - new Date(a[1].lastCompletedAt).getTime())
                          .map(([id, data]) => {
                            const scenario = scenarios.find(s => s.id === id) || { title: id };
                            const avgScore = Object.values(data.averageScores).reduce((sum, val) => sum + val, 0) / 8;
                            
                            return (
                              <tr key={id}>
                                <td className="py-3 pr-4">{scenario.title}</td>
                                <td className="py-3 pr-4">
                                  {format(new Date(data.lastCompletedAt), 'MMM d, yyyy')}
                                </td>
                                <td className="py-3 pr-4">{data.attempts}</td>
                                <td className="py-3">
                                  <div className="flex items-center">
                                    <Progress value={avgScore * 20} className="h-2 w-24 mr-2 bg-speech-light" />
                                    <span>{Math.round(avgScore * 20)}%</span>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="p-8 text-center shadow-sm">
              <div className="mb-4 text-5xl opacity-50">📊</div>
              <h3 className="text-xl font-medium mb-2">No Progress Data Yet</h3>
              <p className="text-speech-dark/70 mb-6">
                Complete some speech activities to see your progress tracked here!
              </p>
              <Button
                onClick={() => navigate('/')}
                className="bg-speech-purple hover:bg-speech-purple/90"
              >
                Start an Activity
              </Button>
            </Card>
          )}
        </div>
      </main>
      
      <footer className="py-4 px-6 text-center text-sm text-speech-dark/60">
        <p>Speech Stars Playtime Pal - Helping children practice speech skills through fun activities!</p>
      </footer>
    </div>
  );
};

export default ProgressPage;
