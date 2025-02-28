import { Box } from "@mui/material";
import { useContext, useState } from "react";
import { AuthContext } from "../../authentication/auth/AuthProvider";
import DefaultTeacherCard from "./TeacherCardComponents/DefaultTeacherCard";
import EditTeacherCard from "./TeacherCardComponents/EditTeacherCard";

export default function TeacherCard() {
    //@ts-expect-error context
    const { userData } = useContext(AuthContext);
    console.log("USER CARD",userData)
    // const [isNameEdited, setIsNameEdited] = useState(false);
    const [edit, setEdit] = useState(false);

    // const [name, setName] = useState(() => {
    //     const fullName = userData?.name || [];
    //     return {
    //         firstname: userData?.firstname || fullName[0] || "",
    //         lastName: userData?.lastname || fullName.slice(1).join(" ") || "",
    //     };
    // })
    const [name, setName] = useState(userData?.name)
    const [title, setTitle] = useState(userData?.title || "");
    const [university, setUniversity] = useState(userData?.university || "");
    const [image, setImage] = useState<string | File>(userData?.image || "");

    

    return (
        <Box
            mx={14}
            display="flex"
            flexDirection="row"
            alignItems="center"
            bgcolor="#FEF4EB"
            boxShadow="0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
            borderRadius="0px 0px 20px 20px"
            width="auto"
            py={4}
            zIndex={0}
            position="relative"
            justifyContent="space-between"
            minHeight="200px"
        >
            {edit ? (
                <EditTeacherCard
                    university={university}
                    setUniversity={setUniversity}
                    name={name}
                    // setName={(updatedName) => {
                    //     setName(updatedName);
                    //     setIsNameEdited(true);
                    // }}
                    setName={setName}
                    title={title}
                    image={image}
                    setImage={setImage}
                    // setIsNameEdited={setIsNameEdited}
                    setTitle={setTitle}
                    setEdit={setEdit}
                />
            ) : (
                <DefaultTeacherCard
                    university={university}
                    name={name}
                    // name={
                    //     isNameEdited
                    //         ? `${name.firstname} ${name.lastName}`.trim()
                    //         : `${userData?.name}`
                    // }
                    title={title}
                    image={image instanceof File ? URL.createObjectURL(image) : image}
                    setEdit={setEdit}
                />
            )}
        </Box>
    );
}
