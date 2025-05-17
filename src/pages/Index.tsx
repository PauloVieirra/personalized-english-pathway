
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
              {t('welcomeHeading', 'Learn English Effectively')}
            </h1>
            <p className="text-xl mb-8 opacity-90">
              {t('welcomeSubheading', 'Master a new language with our interactive platform designed for students of all levels')}
            </p>
            
            {!user && (
              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    {t('getStarted', 'Get Started')}
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 hover:bg-white/20">
                    {t('login', 'Login')}
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
            {t('exploreCities', 'Explore English-Speaking Destinations')}
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
                <CardTitle>{t('london', 'London')}</CardTitle>
                <CardDescription>{t('londonDescription', 'Iconic landmarks and rich history')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('londonText', 'Experience the birthplace of English and immerse yourself in the culture of this global city.')}
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
                <CardTitle>{t('newYork', 'New York')}</CardTitle>
                <CardDescription>{t('newYorkDescription', 'The city that never sleeps')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('newYorkText', 'Discover American English in the heart of one of the world\'s most diverse and exciting cities.')}
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
                <CardTitle>{t('sydney', 'Sydney')}</CardTitle>
                <CardDescription>{t('sydneyDescription', 'Sun, surf and Australian English')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('sydneyText', 'Learn English with an Australian twist while enjoying the beautiful beaches and vibrant culture.')}
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
            {t('whyChooseUs', 'Why Choose Our Platform')}
          </h2>
          <p className="text-center mb-12 max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            {t('platformDescription', 'Our innovative approach to language learning combines technology with proven teaching methods')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border-t-4 border-brand-blue">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-brand-blue" />
                  {t('expertTeachers', 'Expert Teachers')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('teachersDescription', 'Learn from qualified language instructors with years of experience teaching English to international students.')}
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 2 */}
            <Card className="border-t-4 border-brand-green">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-brand-green" />
                  {t('interactiveLessons', 'Interactive Lessons')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('lessonsDescription', 'Engage with dynamic content designed to improve your reading, writing, speaking, and listening skills.')}
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 3 */}
            <Card className="border-t-4 border-brand-blue">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-brand-blue" />
                  {t('personalizedFeedback', 'Personalized Feedback')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('feedbackDescription', 'Receive detailed assessments and guidance tailored to your individual learning needs and goals.')}
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
              {t('aboutUs', 'About Us')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  {t('aboutUsDescription', 'EngLearn was founded in 2020 by a team of passionate language educators who believed that learning English should be accessible, engaging, and effective for everyone.')}
                </p>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  {t('aboutUsMission', 'Our mission is to break down language barriers and open doors to new opportunities for our students through innovative teaching methods and technology.')}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {t('aboutUsVision', 'We envision a world where language is no longer a barrier to education, career advancement, and cross-cultural understanding.')}
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
            {t('testimonials', 'What Our Students Say')}
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
                  "{t('testimonial1', 'The interactive lessons and supportive teachers helped me improve my English dramatically. I\'m now confident speaking in business meetings.')}"
                </p>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src="/avatar1.jpg" alt="Student" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Juan Diaz</p>
                    <p className="text-sm text-gray-500">{t('studentFrom', 'Student from')} {t('mexico', 'Mexico')}</p>
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
                  "{t('testimonial2', 'I tried many English courses before, but this is the only one that kept me engaged and motivated throughout my learning journey.')}"
                </p>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src="/avatar2.jpg" alt="Student" />
                    <AvatarFallback>HS</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Hiroshi Sato</p>
                    <p className="text-sm text-gray-500">{t('studentFrom', 'Student from')} {t('japan', 'Japan')}</p>
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
                  "{t('testimonial3', 'The personalized feedback I received helped me focus on my weak areas. Within six months, I passed my English proficiency exam!')}"
                </p>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src="/avatar3.jpg" alt="Student" />
                    <AvatarFallback>AP</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Ana Petrovic</p>
                    <p className="text-sm text-gray-500">{t('studentFrom', 'Student from')} {t('serbia', 'Serbia')}</p>
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
            {t('recentComments', 'Recent Student Comments')}
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
                        <p className="text-xs text-gray-500">2 {t('daysAgo', 'days ago')}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t('comment1', 'Today\'s pronunciation lesson was extremely helpful. The teacher took time to correct my mistakes individually.')}
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
                        <p className="text-xs text-gray-500">3 {t('daysAgo', 'days ago')}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t('comment2', 'I love the interactive exercises! They make learning grammar so much more engaging than traditional methods.')}
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
                        <p className="text-xs text-gray-500">5 {t('daysAgo', 'days ago')}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t('comment3', 'The business English module has been incredibly practical. I\'m already using the phrases I learned in my work emails.')}
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
                        <p className="text-xs text-gray-500">1 {t('weekAgo', 'week ago')}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t('comment4', 'I appreciate how quickly the teachers respond to questions in the forum. It makes self-study much easier.')}
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
              {t('contactUs', 'Contact Us')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>{t('getInTouch', 'Get in Touch')}</CardTitle>
                  <CardDescription>
                    {t('contactDescription', 'Have questions about our courses? We\'re here to help.')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-brand-blue" />
                    <span>support@englearn.com</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-brand-blue" />
                    <span>{t('scheduleDemo', 'Schedule a Free Demo Class')}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    {t('sendMessage', 'Send Us a Message')}
                  </Button>
                </CardFooter>
              </Card>
              
              <div>
                <Alert className="mb-4">
                  <AlertTitle>{t('officeHours', 'Office Hours')}</AlertTitle>
                  <AlertDescription>
                    {t('officeHoursDescription', 'Monday to Friday: 9am - 6pm (GMT)')}
                  </AlertDescription>
                </Alert>
                
                <Alert className="mb-4">
                  <AlertTitle>{t('faq', 'Frequently Asked Questions')}</AlertTitle>
                  <AlertDescription>
                    <Link to="#" className="flex items-center text-brand-blue hover:underline">
                      {t('viewFaq', 'View our FAQ section')}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <AlertTitle>{t('support', 'Student Support')}</AlertTitle>
                  <AlertDescription>
                    {t('supportDescription', 'Registered students can access additional support through their dashboard.')}
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
                {t('footerDescription', 'Transforming language learning through technology and expert teaching since 2020.')}
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">{t('courses', 'Courses')}</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="#" className="hover:text-white">{t('beginnerCourses', 'Beginner Courses')}</Link></li>
                <li><Link to="#" className="hover:text-white">{t('intermediateCourses', 'Intermediate Courses')}</Link></li>
                <li><Link to="#" className="hover:text-white">{t('advancedCourses', 'Advanced Courses')}</Link></li>
                <li><Link to="#" className="hover:text-white">{t('businessEnglish', 'Business English')}</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">{t('company', 'Company')}</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="#" className="hover:text-white">{t('aboutUs', 'About Us')}</Link></li>
                <li><Link to="#" className="hover:text-white">{t('careers', 'Careers')}</Link></li>
                <li><Link to="#" className="hover:text-white">{t('blog', 'Blog')}</Link></li>
                <li><Link to="#" className="hover:text-white">{t('pressKit', 'Press Kit')}</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">{t('legal', 'Legal')}</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="#" className="hover:text-white">{t('termsOfService', 'Terms of Service')}</Link></li>
                <li><Link to="#" className="hover:text-white">{t('privacyPolicy', 'Privacy Policy')}</Link></li>
                <li><Link to="#" className="hover:text-white">{t('cookies', 'Cookies')}</Link></li>
                <li><Link to="#" className="hover:text-white">{t('accessibility', 'Accessibility')}</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>© 2025 EngLearn. {t('allRightsReserved', 'All rights reserved.')}</p>
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
