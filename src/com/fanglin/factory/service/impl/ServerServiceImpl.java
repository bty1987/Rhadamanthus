/**
 * @File Name		: ServerServiceImpl.java
 * @Package   	: com.fanglin.system.service.impl
 * @Version		: 1.0
 * @Date			: 2017-8-5
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.factory.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.factory.dao.ServerDao;
import com.fanglin.factory.po.ServerPO;
import com.fanglin.factory.service.ServerService;
import com.fanglin.factory.vo.ServerVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;

@Service("serverService")
@Transactional(readOnly=true)
public class ServerServiceImpl implements ServerService {
	
	@Autowired
	private ServerDao serverDao;
	
	@Autowired
	private UserDao userDao;
	
	@Override
	public List<ServerVO> queryServer(UserVO userVO) throws FLException {
		
		UserPO userPO = userDao.queryUserByUserId(userVO.getUserId());
		
		if(userPO == null){
			throw new FLException(190005, "人员不存在");
		}
		
		List<ServerPO> serverPOs = serverDao.queryServerByCompany(userPO.getCompany());
		List<ServerVO> serverVOs = new ArrayList<ServerVO>();
		
		ServerVO serverVO;
		
		for(ServerPO serverPO: serverPOs){
			
			serverVO = new ServerVO();
			
			BeanUtil.copyProperties(serverPO, serverVO);
			
			serverVOs.add(serverVO);
		}
		
		return serverVOs;
	}

}
