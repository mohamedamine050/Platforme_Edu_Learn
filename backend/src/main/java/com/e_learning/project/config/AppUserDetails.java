package com.e_learning.project.config;

import com.e_learning.project.model.UserEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

// UserDetails enrichi de l'identifiant de session, pour permettre au filtre JWT
// de vérifier qu'une seule session est active à la fois.
public class AppUserDetails extends User {

    private final String sessionId;

    public AppUserDetails(UserEntity entity, Collection<? extends GrantedAuthority> authorities) {
        super(entity.getEmail(), entity.getPassword(), entity.isActive(), true, true, true, authorities);
        this.sessionId = entity.getSessionId();
    }

    public String getSessionId() {
        return sessionId;
    }
}
