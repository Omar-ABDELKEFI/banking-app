package com.banking.mapper;

import com.banking.dto.ClientRequestDto;
import com.banking.dto.ClientResponseDto;
import com.banking.model.Client;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ClientMapper {
    @Mapping(target = "id", ignore = true)
    Client toEntity(ClientRequestDto dto);
    
    ClientResponseDto toResponseDto(Client entity);
}
