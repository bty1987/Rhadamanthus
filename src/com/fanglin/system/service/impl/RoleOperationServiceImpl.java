/**
 * @File Name		: RoleOperationServiceImpl.java
 * @Package   	: com.fanglin.system.service.impl
 * @Version		: 1.0
 * @Date			: 2026-07-28
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Describing	: 角色-操作关联的跨公司同步实现
 */

package com.fanglin.system.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.system.dao.RoleOperationDao;
import com.fanglin.system.service.RoleOperationService;
import com.fanglin.system.vo.CompanyVO;
import com.fanglin.system.vo.RoleVO;

@Service("roleOperationService")
@Transactional(readOnly = true)
public class RoleOperationServiceImpl implements RoleOperationService {

	@Autowired
	private RoleOperationDao roleOperationDao;

	@Autowired
	private UserDao userDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int syncRoleOperation(RoleVO roleVO, List<CompanyVO> companyVOs, String userId, Integer company) throws FLException {

		List<Integer> cids = new ArrayList<Integer>();

		for (CompanyVO companyVO : companyVOs) {
			cids.add(CompanyServiceImpl.decode(companyVO.getCid()));
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		roleOperationDao.deleteRoleOperation(roleVO.getRid(), cids);
		roleOperationDao.syncRoleOperation(roleVO.getRid(), operater.getUid(), cids, company);

		return 0;
	}

}
