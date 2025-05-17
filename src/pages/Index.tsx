
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, MessageSquare, Mail, Star, ChevronRight } from 'lucide-react';

const Index = () => {
  const { t } = useLanguage();
  const { user, userDetails } = useAuth();

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-brand-darkBlue to-brand-blue text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
              {t('welcomeHeading')}
            </h1>
            <p className="text-xl mb-8 opacity-90">
              {t('welcomeSubheading')}
            </p>
            
            {!user && (
              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    {t('getStarted')}
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 hover:bg-white/20">
                    {t('login')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* City Showcase Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('exploreCities')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* London */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="/london.jpg" 
                  alt="London" 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle>{t('london')}</CardTitle>
                <CardDescription>{t('londonDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('londonText')}
                </p>
              </CardContent>
            </Card>
            
            {/* New York */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="/new-york.jpg" 
                  alt="New York" 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle>{t('newYork')}</CardTitle>
                <CardDescription>{t('newYorkDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('newYorkText')}
                </p>
              </CardContent>
            </Card>
            
            {/* Sydney */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="/sydney.jpg" 
                  alt="Sydney" 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle>{t('sydney')}</CardTitle>
                <CardDescription>{t('sydneyDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('sydneyText')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            {t('whyChooseUs')}
          </h2>
          <p className="text-center mb-12 max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            {t('platformDescription')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border-t-4 border-brand-blue">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-brand-blue" />
                  {t('expertTeachers')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('teachersDescription')}
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 2 */}
            <Card className="border-t-4 border-brand-green">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-brand-green" />
                  {t('interactiveLessons')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('lessonsDescription')}
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 3 */}
            <Card className="border-t-4 border-brand-blue">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-brand-blue" />
                  {t('personalizedFeedback')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('feedbackDescription')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              {t('aboutUs')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  {t('aboutUsDescription')}
                </p>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  {t('aboutUsMission')}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {t('aboutUsVision')}
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <img src="/team1.jpg" alt="Team Member" className="w-24 h-24 rounded-full mx-auto mb-2 object-cover" />
                  <h4 className="font-medium">Sarah Johnson</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Founder</p>
                </div>
                <div className="text-center">
                  <img src="/team2.jpg" alt="Team Member" className="w-24 h-24 rounded-full mx-auto mb-2 object-cover" />
                  <h4 className="font-medium">David Chen</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Head Teacher</p>
                </div>
                <div className="text-center">
                  <img src="/team3.jpg" alt="Team Member" className="w-24 h-24 rounded-full mx-auto mb-2 object-cover" />
                  <h4 className="font-medium">Maria Rodriguez</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Curriculum Director</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('testimonials')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic mb-4">
                  "{t('testimonial1')}"
                </p>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src="/avatar1.jpg" alt="Student" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Juan Diaz</p>
                    <p className="text-sm text-gray-500">{t('studentFrom')} {t('mexico')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Testimonial 2 */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic mb-4">
                  "{t('testimonial2')}"
                </p>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src="/avatar2.jpg" alt="Student" />
                    <AvatarFallback>HS</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Hiroshi Sato</p>
                    <p className="text-sm text-gray-500">{t('studentFrom')} {t('japan')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Testimonial 3 */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic mb-4">
                  "{t('testimonial3')}"
                </p>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src="/avatar3.jpg" alt="Student" />
                    <AvatarFallback>AP</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Ana Petrovic</p>
                    <p className="text-sm text-gray-500">{t('studentFrom')} {t('serbia')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            {t('recentComments')}
          </h2>
          
          <Card className="max-w-3xl mx-auto">
            <CardContent className="pt-6">
              <ScrollArea className="h-64">
                <div className="space-y-4">
                  {/* Comment 1 */}
                  <div className="pb-4">
                    <div className="flex items-center mb-2">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>M</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Miguel Sanchez</p>
                        <p className="text-xs text-gray-500">2 {t('daysAgo')}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t('comment1')}
                    </p>
                  </div>
                  <Separator />
                  
                  {/* Comment 2 */}
                  <div className="pb-4">
                    <div className="flex items-center mb-2">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>L</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Lina Kim</p>
                        <p className="text-xs text-gray-500">3 {t('daysAgo')}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t('comment2')}
                    </p>
                  </div>
                  <Separator />
                  
                  {/* Comment 3 */}
                  <div className="pb-4">
                    <div className="flex items-center mb-2">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>R</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Ravi Patel</p>
                        <p className="text-xs text-gray-500">5 {t('daysAgo')}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t('comment3')}
                    </p>
                  </div>
                  <Separator />
                  
                  {/* Comment 4 */}
                  <div>
                    <div className="flex items-center mb-2">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>E</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Elena Popescu</p>
                        <p className="text-xs text-gray-500">1 {t('weekAgo')}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t('comment4')}
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              {t('contactUs')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>{t('getInTouch')}</CardTitle>
                  <CardDescription>
                    {t('contactDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-brand-blue" />
                    <span>support@englearn.com</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-brand-blue" />
                    <span>{t('scheduleDemo')}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    {t('sendMessage')}
                  </Button>
                </CardFooter>
              </Card>
              
              <div>
                <Alert className="mb-4">
                  <AlertTitle>{t('officeHours')}</AlertTitle>
                  <AlertDescription>
                    {t('officeHoursDescription')}
                  </AlertDescription>
                </Alert>
                
                <Alert className="mb-4">
                  <AlertTitle>{t('faq')}</AlertTitle>
                  <AlertDescription>
                    <Link to="#" className="flex items-center text-brand-blue hover:underline">
                      {t('viewFaq')}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <AlertTitle>{t('support')}</AlertTitle>
                  <AlertDescription>
                    {t('supportDescription')}
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">EngLearn</h3>
              <p className="text-sm text-gray-300">
                {t('footerDescription')}
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">{t('courses')}</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="#" className="hover:text-white">{t('beginnerCourses')}</Link></li>
                <li><Link to="#" className="hover:text-white">{t('intermediateCourses')}</Link></li>
                <li><Link to="#" className="hover:text-white">{t('advancedCourses')}</Link></li>
                <li><Link to="#" className="hover:text-white">{t('businessEnglish')}</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">{t('company')}</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="#" className="hover:text-white">{t('aboutUs')}</Link></li>
                <li><Link to="#" className="hover:text-white">{t('careers')}</Link></li>
                <li><Link to="#" className="hover:text-white">{t('blog')}</Link></li>
                <li><Link to="#" className="hover:text-white">{t('pressKit')}</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">{t('legal')}</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="#" className="hover:text-white">{t('termsOfService')}</Link></li>
                <li><Link to="#" className="hover:text-white">{t('privacyPolicy')}</Link></li>
                <li><Link to="#" className="hover:text-white">{t('cookies')}</Link></li>
                <li><Link to="#" className="hover:text-white">{t('accessibility')}</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>© 2025 EngLearn. {t('allRightsReserved')}</p>
          </div>
        </div>
      </footer>

      {user && (
        <section className="py-8 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-4">
              {t('yourDashboard')}
            </h2>
            {userDetails?.role === 'teacher' ? (
              <Card>
                <CardHeader>
                  <CardTitle>{t('teacherDashboard')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{t('teacherDashboardDescription')}</p>
                  <Link to="/teacher/dashboard" className="mt-4 inline-block">
                    <Button>{t('goToDashboard')}</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : userDetails?.role === 'student' ? (
              <Card>
                <CardHeader>
                  <CardTitle>{t('studentDashboard')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{t('studentDashboardDescription')}</p>
                  <Link to="/student/dashboard" className="mt-4 inline-block">
                    <Button>{t('goToDashboard')}</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <p>{t('unrecognizedRole')}</p>
            )}
          </div>
        </section>
      )}
      
    </MainLayout>
  );
};

export default Index;
