package com.fanglin.customer.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.customer.service.GroupUserService;

@Service("groupUserService")
@Transactional(readOnly=true)
public class GroupUserServiceImpl implements GroupUserService{
	

}
