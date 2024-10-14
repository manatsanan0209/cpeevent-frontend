import ProtectedRoute from '@/router/ProtectedRoute';

const ProtectedLayout = ({
   children,
   requiredAccess,
}: {
   children: React.ReactNode;
   requiredAccess: string;
}) => {
   return (
      <ProtectedRoute requiredAccess={requiredAccess}>
         {children}
      </ProtectedRoute>
   );
};

export default ProtectedLayout;
