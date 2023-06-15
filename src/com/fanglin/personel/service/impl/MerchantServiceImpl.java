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
import com.fanglin.personel.dao.MerchantDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.service.MerchantService;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.Paging;

@Service("merchantService")
@Transactional(readOnly = true)
public class MerchantServiceImpl implements MerchantService {

	@Autowired
	private MerchantDao merchantDao;

	@Override
	public void pageMerchant(Paging paging, List<Filter> filters) throws FLException {

		List<UserPO> merchantPOs = merchantDao.pageMerchant(paging, filters);
		List<UserVO> merchantVOs = new ArrayList<UserVO>();

		for (UserPO merchantPO : merchantPOs) {
			merchantVOs.add(new UserVO(new RoleVO(), new DepartmentVO(), new DutyVO()).ptv(merchantPO));
		}

		paging.setData(merchantVOs);
	}

	@Override
	public List<UserVO> queryMerchantByPinyin(String pinyin) throws FLException {

		List<UserVO> merchantVOs = new ArrayList<UserVO>();
		List<UserPO> merchantPOs = merchantDao.queryMerchantByPinyin(pinyin);

		for (UserPO merchantPO : merchantPOs) {
			merchantVOs.add(new UserVO(new RoleVO(), new DepartmentVO(), new DutyVO()).ptv(merchantPO));
		}

		return merchantVOs;
	}

}
