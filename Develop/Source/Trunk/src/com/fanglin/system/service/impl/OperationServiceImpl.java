/**
 * @File Name		: OperationServiceImpl.java
 * @Package   	: com.fanglin.system.service.impl
 * @Version		: 1.0
 * @Date			: 2016-4-21
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.system.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.dao.OperationDao;
import com.fanglin.system.dao.RoleDao;
import com.fanglin.system.dao.RoleOperationDao;
import com.fanglin.system.po.OperationPO;
import com.fanglin.system.po.RoleOperationPO;
import com.fanglin.system.po.RolePO;
import com.fanglin.system.service.OperationService;
import com.fanglin.system.vo.OperationVO;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.BeanUtil;

@Service("operationService")
@Transactional(readOnly=true)
public class OperationServiceImpl implements OperationService {
	
	@Autowired
	private OperationDao operationDao;
	
	@Autowired
	private RoleOperationDao roleOperationDao;
	
	@Autowired
	private RoleDao roleDao;
	
	@Autowired
	private UserDao userDao;

	@Override
	public List<OperationVO> queryOperation() {
		
		List<OperationPO> operationPOs = operationDao.queryOperation();
		List<OperationVO> operationVOs = new ArrayList<OperationVO>();
		
		for(OperationPO operationPO: operationPOs){
			
			OperationVO operationVO = new OperationVO();
			
			BeanUtil.copyProperties(operationPO, operationVO, Arrays.asList("module"));
			
			operationVOs.add(operationVO);
		}
		
		return operationVOs;
	}

	@Override
	public List<OperationVO> queryOperationByUserId(OperationVO operationVO, UserVO userVO) throws FLException {
		
		UserPO userPO = userDao.get(userVO.getUserId());
		
		if(userPO == null){
			throw new FLException(220005, "员工不存在");
		}
		
		List<RoleOperationPO> roleOperationPOs = roleOperationDao.queryRoleOperationByRId(userPO.getRole().getrId(), operationVO.getSystem());
		List<OperationVO> operationVOs = new ArrayList<OperationVO>();
		
		for(RoleOperationPO roleOperationPO: roleOperationPOs){
			OperationVO _operationVO = new OperationVO();
			
			BeanUtil.copyProperties(roleOperationPO.getOperation(), _operationVO, Arrays.asList("module"));
			
			operationVOs.add(_operationVO);
		}
		
		return operationVOs;
	}

	@Override
	public boolean checkOperationByUserId(String userId, String operation) throws FLException {
		
		UserPO userPO = userDao.get(userId);
		
		if(userPO == null){
			throw new FLException(220005, "员工不存在");
		}
		
		OperationPO operationPO = operationDao.queryOperationByOperation(operation);
		
		if(operationPO != null){
			
			RoleOperationPO roleOperationPO = roleOperationDao.get(operationPO.getoId());
			
			if(roleOperationPO == null){
				return false;
			}
		}
		
		return true;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateRoleOperationByRoleId(List<Integer> oIds, OperationVO operationVO, RoleVO roleVO) throws FLException {
		
		RolePO rolePO = roleDao.get(roleVO.getRoleId());
		
		if(rolePO == null){
			throw new FLException(230010, "角色不存在");
		}
		
		roleOperationDao.deleteRoleOperationByRId(rolePO.getrId(), operationVO.getSystem());
		
		if(oIds != null && oIds.size() > 0){
			for(Integer oId: oIds){
				RoleOperationPO roleOperationPO = new RoleOperationPO(rolePO, new OperationPO(oId));
				
				roleOperationDao.save(roleOperationPO);
			}
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateRoleOperationByUserId(List<Integer> oIds, OperationVO operationVO, UserVO userVO) throws FLException {
		
		UserPO userPO = userDao.get(userVO.getUserId());
		
		if(userPO == null){
			throw new FLException(220005, "员工不存在");
		}
		
		roleOperationDao.deleteRoleOperationByRId(userPO.getRole().getrId(), operationVO.getSystem());
		
		if(oIds != null && oIds.size() > 0){
			for(Integer oId: oIds){
				RoleOperationPO roleOperationPO = new RoleOperationPO(userPO.getRole(), new OperationPO(oId));
				
				roleOperationDao.save(roleOperationPO);
			}
		}
		
		return 0;
	}

}
