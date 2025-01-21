package com.banking.mapper;

import com.banking.dto.ClientRequestDto;
import com.banking.dto.ClientResponseDto;
import com.banking.model.Client;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ClientMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    Client toEntity(ClientRequestDto dto);

    ClientResponseDto toResponseDto(Client client);
}
