/**
 * @File Name		: SupplierServiceImpl.java
 * @Package   	: com.fanglin.data.service.impl
 * @Version		: 1.0
 * @Date			: 2016-9-22
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.SupplierDao;
import com.fanglin.communion.po.SupplierPO;
import com.fanglin.communion.service.SupplierService;
import com.fanglin.communion.vo.SupplierVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.MD5Helper;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Service("supplierService")
@Transactional(readOnly=true)
public class SupplierServiceImpl implements SupplierService {
	
	@Autowired
	private SupplierDao supplierDao;

	@Override
	public void pageSupplier(Paging paging, List<Filter> filters) {
		
		List<SupplierPO> supplierPOs = supplierDao.pageSupplier(paging, filters);
		List<SupplierVO> supplierVOs = new ArrayList<SupplierVO>();
		
		SupplierVO supplierVO;
		
		for(SupplierPO supplierPO: supplierPOs){
			
			supplierVO = new SupplierVO();
			
			BeanUtil.copyProperties(supplierPO, supplierVO);
			
			supplierVOs.add(supplierVO);
		}
		
		paging.setData(supplierVOs);
	}

	@Override
	public SupplierVO querySupplierBySId(SupplierVO supplierVO) throws FLException {
		
		SupplierPO supplierPO = supplierDao.get(supplierVO.getSid());
		
		if(supplierPO != null){
			BeanUtil.copyProperties(supplierPO, supplierVO);
		}
		
		return supplierVO;
	}

	@Override
	public SupplierVO querySupplierByLoginId(SupplierVO supplierVO) throws FLException {
		
		SupplierPO supplierPO = supplierDao.querySupplierByLoginId(supplierVO.getLoginId());
		
		if(supplierPO != null){
			BeanUtil.copyProperties(supplierPO, supplierVO);
		}
		
		return supplierVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addSupplier(SupplierVO supplierVO) throws FLException {
		
		SupplierPO supplierPO = supplierDao.querySupplierByLoginId(supplierVO.getLoginId());
		
		if(supplierPO != null){
			throw new FLException(130007, "厂商登陆名已存在");
		}

		supplierPO = new SupplierPO();
		
		BeanUtil.copyProperties(supplierVO, supplierPO, "sid", "isLogin");
		
		supplierPO.setPassword(MD5Helper.MD5(SystemConfig.getString("defaultPassword", "fanglin")));
		supplierPO.setIsLogin((short) 0);
		
		supplierDao.save(supplierPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateSupplier(SupplierVO supplierVO) throws FLException {
		
		SupplierPO supplierPO = supplierDao.get(supplierVO.getSid());
		
		if(supplierPO == null){
			throw new FLException(130008, "厂商不存在");
		}
		
		supplierPO.setName(supplierVO.getName());
		
		supplierDao.update(supplierPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateSupplierForLogin(SupplierVO supplierVO) throws FLException {
		
		SupplierPO supplierPO = supplierDao.get(supplierVO.getSid());
		
		if(supplierPO == null){
			throw new FLException(130008, "厂商不存在");
		}
		
		supplierPO.setIsLogin(supplierVO.getIsLogin());
		
		supplierDao.update(supplierPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateSupplierForPassword(SupplierVO supplierVO, String password) throws FLException {
		
		SupplierPO supplierPO = supplierDao.get(supplierVO.getSid());
		
		if(supplierPO == null){
			throw new FLException(130008, "厂商不存在");
		}
		
		if(!supplierPO.getPassword().equals(MD5Helper.MD5(password))){
			throw new FLException(110009, "原密码错误");
		}
		
		supplierPO.setPassword(MD5Helper.MD5(supplierVO.getPassword()));
		
		supplierDao.update(supplierPO);
		
		return 0;
	}
	
}
