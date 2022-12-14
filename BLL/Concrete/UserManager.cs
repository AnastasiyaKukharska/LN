using BLL.Interface;
using DAL.Interface;
using DTO.Vertices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Concrete
{
    public class UserManager : IUserManager
    {
        private readonly IUserDal _userDal;
        private readonly IRoleEdgeDal _roleEdgeDal;
        private readonly IRoleDal _roleDal;
        public UserManager(IUserDal userDal, IRoleEdgeDal roleEdgeDal, IRoleDal roleDal)
        {
            _userDal = userDal;
            _roleEdgeDal = roleEdgeDal;
            _roleDal = roleDal;
        }
        public UserDTO AddUser(UserDTO user)
        {
            user = _userDal.AddUser(user);
            var roles = _roleDal.GetAllRoles();

            foreach (var add_role in user.Roles)
            {
                RoleDTO? to_add = roles.Find(find => find.Name == add_role.Name);
                if (to_add is not null)
                    this._roleEdgeDal.AddRoleToUser(user, to_add);
            }
            this.AttachUserRoles(ref user);
            return user;
        }

        public List<UserDTO> GetAllUsers()
        {
            var users = _userDal.GetAllUsers();
            users.ForEach(user => { this.AttachUserRoles(ref user); });
            return users;
        }

        public UserDTO GetUser(string username)
        {
            var user = _userDal.GetUserByName(username);
            this.AttachUserRoles(ref user);
            return user;
        }

        public List<RoleDTO> GetUserRoles(string username)
        {
            return this.GetUser(username).Roles;
        }

        public bool LoginUser(UserDTO user)
        {
            return _userDal.LoginUser(user);
        }

        private void AttachUserRoles(ref UserDTO user)
        {
            user.Roles = _roleEdgeDal.GetUserRoles(user);
        }
    }
}
