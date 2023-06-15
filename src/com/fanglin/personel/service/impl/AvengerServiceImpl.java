/**
 * @File Name		: SupplierServiceImpl.java
 * @Package   	: com.fanglin.personel.service.impl
 * @Version		: 1.0
 * @Date			: 2019-10-11
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.personel.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.AvengerDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.service.AvengerService;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.Paging;

@Service("avengerService")
@Transactional(readOnly = true)
public class AvengerServiceImpl implements AvengerService {

	@Autowired
	private AvengerDao avengerDao;

	@Override
	public void pageAvenger(Paging paging, List<Filter> filters) throws FLException {

		List<UserPO> avengerPOs = avengerDao.pageAvenger(paging, filters);
		List<UserVO> avengerVOs = new ArrayList<UserVO>();

		for (UserPO avengerPO : avengerPOs) {
			avengerVOs.add(new UserVO(new RoleVO(), new DepartmentVO(), new DutyVO()).ptv(avengerPO));
		}

		paging.setData(avengerVOs);
	}

	@Override
	public List<UserVO> queryAvengerByPinyin(String pinyin) throws FLException {

		List<UserVO> avengerVOs = new ArrayList<UserVO>();

		List<UserPO> avengerPOs = avengerDao.queryAvengerByPinyin(pinyin);

		for (UserPO avengerPO : avengerPOs) {
			avengerVOs.add(new UserVO(new RoleVO(), new DepartmentVO(), new DutyVO()).ptv(avengerPO));
		}

		return avengerVOs;
	}

}
