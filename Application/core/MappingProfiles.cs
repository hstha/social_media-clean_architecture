using System;
using System.Reflection;

namespace Application.core
{
  ///<summary>This class holds the logic to map target object to source object</summary>
  public class MappingProfiles<T>
    {
        ///<summary>Maps targetObject value to srcObject value their key's value is not same </summary>
        ///<param name="srcObject">Object which value is to be updated</param>
        ///<param name="targetObject">Object form whose value needs to be updated</param>
        public static void map(T srcObject, T targetObject) 
        {
            Type oldObjectType = srcObject.GetType();
            PropertyInfo[] sourceProprties = oldObjectType.GetProperties(BindingFlags.Instance | BindingFlags.Public);
            
            foreach (var sourceProp in sourceProprties)
            {   
                var oldValue = sourceProp.GetValue(srcObject, null);
                var newValue = sourceProp.GetValue(targetObject, null);
                if(oldValue != newValue && newValue != null) {
                    sourceProp.SetValue(srcObject, newValue);
                }
            }
        }
    }
}