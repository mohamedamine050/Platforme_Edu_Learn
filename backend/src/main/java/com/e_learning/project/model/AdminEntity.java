package com.e_learning.project.model;

import com.e_learning.project.enums.Role;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "admins")
@DiscriminatorValue("ADMIN")
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class AdminEntity extends UserEntity {

    @Override
    public Role getRole() {
        return Role.ADMIN;
    }
}
