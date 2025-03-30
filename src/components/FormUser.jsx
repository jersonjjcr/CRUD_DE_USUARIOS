import { useForm, Controller} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button, Input, FileUpload, Float, useFileUploadContext } from "@chakra-ui/react"
import { PasswordInput } from "./ui/password-input"
import { LuFileImage, LuX } from "react-icons/lu"
import './FormUser.css'
import { DatePicker } from "antd"
import { useEffect } from "react"
import { useState } from "react"
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);


const schema = z.object({
    first_name: z.string().min(1, { message: 'El nombre es requerido' }),
    last_name: z.string().min(1, { message: 'El apellido es requerido' }),
    email: z.string().email({ message: 'Correo invalido' }),
    password: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
    birthday: z.date({
        required_error: "La fecha de nacimiento es requerida"
    })
    .refine(date => {
        const today = dayjs();
        const birthday = dayjs(date);
        return today.diff(birthday, 'year') >= 18;
    }, {
        message: "Debes ser mayor de 18 años"
    }),
    image_url: z.string().nonempty()
})

const dateFormat = 'YYYY-MM-DD';


function FormUser({user = null,addUser, editUser, closeModal }) {
   console.log(user);
    const [dataForm, setDataForm] = useState()

   
    

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            birthday: null,
            image_url: ''
        }
    });
    

    useEffect(() => {
        if (user) {
            reset({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                password: user.password || '', // No prellenar por seguridad
                // birthday: user.birthday ? dayjs.utc(user.birthday).format('YYYY-MM-DD') : null, 
                birthday: user.birthday ? dayjs(user.birthday).add(1, 'day').toDate() : null,
                image_url: user.image_url || ''
            });
        }
    }, [user, reset]);
    

    const onSubmit = (data) => {
        const formattedData = {
            ...data,
            birthday: dayjs(data.birthday).format('YYYY-MM-DD') // Convierte Date a string
        };

        if (user) {
            editUser(user.id, formattedData); 
        } else {
            addUser(formattedData); 
        }

        reset();

        if (closeModal) {
            closeModal(); 
        }
    };
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="form" >
                <div className="card">
                    <label >
                        <p>Nombre(s):</p>
                        <Input
                            {...register('first_name')}
                            placeholder='Escribe tu nombre'
                        />
                        {errors.first_name && <p className="error-message">{errors.first_name.message}</p>}
                    </label>
                </div>

                <div className="card">
                    <label >
                        <p>Apellidos:</p>
                        <Input
                            {...register('last_name')}
                            placeholder='Escribe tu apellido'
                        />
                        {errors.last_name && <p className="error-message">{errors.last_name.message}</p>}
                    </label>
                </div>




                <div className="card">
                    <label >
                        <p>Correo:</p>
                        <Input
                            type='email'
                            {...register('email')}
                            placeholder='Escribe tu correo'
                        />
                        {errors.email && <p className="error-message">{errors.email.message}</p>}
                    </label>
                </div>

                <div className="card">
                    <label >
                        <p>Contraseña:</p>
                        <PasswordInput
                            type='password'
                            {...register('password')}
                            placeholder='Escribe tu contraseña'
                        />
                        {errors.password && <p className="error-message">{errors.password.message}</p>}
                    </label>
                </div>

                <div className="card">
    <label>
        <p>Cumpleaños:</p>
        <Controller
    control={control}
    name="birthday"
    render={({ field }) => (
        <DatePicker
            {...field}
            format={dateFormat}
            placeholder="Seleccionar fecha"
            className="birthday-input"
            value={field.value ? dayjs(field.value) : null} 
            onChange={(date) => field.onChange(date ? date.toDate() : null)} 
        />
    )}
/>

        {errors.birthday && <p className="error-message">{errors.birthday.message}</p>}
    </label>
</div>

<div className="card">
<p>Imagen:</p>
                <Input
              
                
                    type="url"
                    placeholder='Adjunta una imagen'
                    {...register("image_url")}
                />
                {errors.image_url && <p className="error-message">{errors.image_url.message}</p>}
            </div>

                <Button type='submit' variant="subtle" className="button-form">{user ? 'Edit' : 'Add'}</Button>
            </form>
        </div>
    )
}

export default FormUser