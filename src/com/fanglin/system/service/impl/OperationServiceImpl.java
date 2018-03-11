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
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.dao.ModuleDao;
import com.fanglin.system.dao.OperationDao;
import com.fanglin.system.dao.RoleDao;
import com.fanglin.system.dao.RoleOperationDao;
import com.fanglin.system.po.ModulePO;
import com.fanglin.system.po.OperationPO;
import com.fanglin.system.po.RoleOperationPO;
import com.fanglin.system.po.RolePO;
import com.fanglin.system.service.OperationService;
import com.fanglin.system.vo.OperationVO;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

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
	
	@Autowired
	private ModuleDao moduleDao;
	
	@Override
	public void pageOperation(Paging paging, List<Filter> filters) {
		
		List<OperationPO> operationPOs = operationDao.pageOperation(paging, filters);
		List<OperationVO> operationVOs = new ArrayList<OperationVO>();
		
		for(OperationPO operationPO: operationPOs){
			
			OperationVO operationVO = new OperationVO();
			
			BeanUtil.copyProperties(operationPO, operationVO, Arrays.asList("module"));
			
			operationVOs.add(operationVO);
		}
		
		paging.setData(operationVOs);
	}

	@Override
	public List<OperationVO> queryOperation(OperationVO operationVO) {
		
		List<OperationPO> operationPOs = operationDao.queryOperationBySystem(operationVO.getSystem());
		List<OperationVO> operationVOs = new ArrayList<OperationVO>();
		
		for(OperationPO operationPO: operationPOs){
			
			OperationVO _operationVO = new OperationVO();
			
			BeanUtil.copyProperties(operationPO, _operationVO, Arrays.asList("module"));
			
			operationVOs.add(_operationVO);
		}
		
		return operationVOs;
	}

	@Override
	public List<OperationVO> queryOperationByUserId(OperationVO operationVO, UserVO userVO) throws FLException {
		
		UserPO userPO = userDao.get(userVO.getUserId());
		
		if(userPO == null){
			throw new FLException(190005, "人员不存在");
		}
		
		List<RoleOperationPO> roleOperationPOs = roleOperationDao.queryRoleOperationByRid(userPO.getRole().getRid(), operationVO.getSystem());
		List<OperationVO> operationVOs = new ArrayList<OperationVO>();
		
		for(RoleOperationPO roleOperationPO: roleOperationPOs){
			OperationVO _operationVO = new OperationVO();
			
			BeanUtil.copyProperties(roleOperationPO.getOperation(), _operationVO, Arrays.asList("module"));
			
			operationVOs.add(_operationVO);
		}
		
		return operationVOs;
	}
	
	@Override
	public List<OperationVO> queryOperationByRid(OperationVO operationVO, RoleVO roleVO) throws FLException {
		
		RolePO rolePO = roleDao.get(roleVO.getRid());
		
		if(rolePO == null){
			throw new FLException(230010, "角色不存在");
		}
		
		List<RoleOperationPO> roleOperationPOs = roleOperationDao.queryRoleOperationByRid(rolePO.getRid(), operationVO.getSystem());
		List<OperationVO> operationVOs = new ArrayList<OperationVO>();
		
		for(RoleOperationPO roleOperationPO: roleOperationPOs){
			OperationVO _operationVO = new OperationVO();
			
			BeanUtil.copyProperties(roleOperationPO.getOperation(), _operationVO, Arrays.asList("module"));
			
			operationVOs.add(_operationVO);
		}
		
		return operationVOs;
	}

	@Override
	public boolean checkOperationByUserId(String userId, String operation, short rollcall) throws FLException {
		
		boolean result = false;
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		if(userPO == null){
			throw new FLException(220005, "员工不存在");
		}
		
		OperationPO operationPO = operationDao.queryOperationByOperation(operation);
		
		if(operationPO != null){
			
			RoleOperationPO roleOperationPO = roleOperationDao.queryRoleOperationByRidAOid(userPO.getRole().getRid(), operationPO.getOid());
			
			result = roleOperationPO != null;
		}else{
			result = true;
		}
		
		return rollcall == 0 ? result : !result; 
	}


	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateRoleOperationByRid(List<Integer> oids, OperationVO operationVO, RoleVO roleVO) throws FLException {
		
		RolePO rolePO = roleDao.get(roleVO.getRid());
		
		if(rolePO == null){
			throw new FLException(230010, "角色不存在");
		}
		
		roleOperationDao.deleteRoleOperationByRid(rolePO.getRid(), operationVO.getSystem());
		
		if(oids != null && oids.size() > 0){
			for(Integer oid: oids){
				RoleOperationPO roleOperationPO = new RoleOperationPO(new OperationPO(oid), rolePO.getRid());
				
				roleOperationDao.save(roleOperationPO);
			}
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateRoleOperationByUserId(List<Integer> oids, OperationVO operationVO, UserVO userVO) throws FLException {
		
		UserPO userPO = userDao.queryUserByUserId(userVO.getUserId());
		
		if(userPO == null){
			throw new FLException(190005, "人员不存在");
		}
		
		roleOperationDao.deleteRoleOperationByRid(userPO.getRole().getRid(), operationVO.getSystem());
		
		if(oids != null && oids.size() > 0){
			for(Integer oid: oids){
				RoleOperationPO roleOperationPO = new RoleOperationPO(new OperationPO(oid), userPO.getRole().getRid());
				
				roleOperationDao.save(roleOperationPO);
			}
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteOperation(OperationVO operationVO) throws FLException {
		
		int oid = operationVO.getOid();
		
		if(roleOperationDao.countRoleOperationByOid(oid) > 0){
			throw new FLException(230013, "操作已经被引用,不能被删除");
		}
		
		operationDao.deleteById(oid);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addOperation(OperationVO operationVO) {
		
		OperationPO operationPO = new OperationPO(new ModulePO());
		
		BeanUtil.copyProperties(operationVO, operationPO, Arrays.asList("module"));
		
		ModulePO modulePO = moduleDao.get(operationVO.getModule().getMid()); 
		operationPO.setModule(modulePO);
		
		operationDao.save(operationPO);
	}

}
