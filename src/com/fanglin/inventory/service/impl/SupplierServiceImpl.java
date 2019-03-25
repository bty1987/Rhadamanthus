package com.fanglin.inventory.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.dao.SupplierDao;
import com.fanglin.inventory.po.SupplierPO;
import com.fanglin.inventory.service.SupplierService;
import com.fanglin.inventory.vo.SupplierVO;
import com.fanglin.utils.BeanUtil;

@Service("supplierService")
@Transactional(readOnly=true)
public class SupplierServiceImpl implements SupplierService{

	@Autowired
	private SupplierDao supplierDao;
	
	@Override
	public List<SupplierVO> querySupplierByGid(SupplierVO supplierVO) {
		
		List<SupplierPO> supplierPOs = supplierDao.querySupplierByGid(supplierVO.getGid());
		List<SupplierVO> supplierVOs = new ArrayList<SupplierVO>();
		
		for (SupplierPO supplierPO : supplierPOs) {
			supplierVO = new SupplierVO();
			
			BeanUtil.copyProperties(supplierPO, supplierVO);
			
			supplierVOs.add(supplierVO);
		}
		
		return supplierVOs;
	}

	@Override
	public List<SupplierVO> querySupplierForEnableByGid(SupplierVO supplierVO) {
		
		List<SupplierPO> supplierPOs = supplierDao.querySupplierForEnableByGid(supplierVO.getGid());
		List<SupplierVO> supplierVOs = new ArrayList<SupplierVO>();
		
		for (SupplierPO supplierPO : supplierPOs) {
			supplierVO = new SupplierVO();
			
			BeanUtil.copyProperties(supplierPO, supplierVO);
			
			supplierVOs.add(supplierVO);
		}
		
		return supplierVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addSupplier(SupplierVO supplierVO) throws FLException {
		
		SupplierPO supplierPO = supplierDao.querySupplierByName(supplierVO.getGid(),supplierVO.getName());
		
		if(supplierPO != null){
			throw new FLException(260050, "供应商已存在");
		}
		
		supplierPO = new SupplierPO();
		
		BeanUtil.copyProperties(supplierVO, supplierPO);
		supplierPO.setStatus(SupplierPO.STATUS_ENABLE_INT);
		
		supplierDao.save(supplierPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateSupplierForStatus(SupplierVO supplierVO) throws FLException {
		
		SupplierPO supplierPO = supplierDao.get(supplierVO.getSid());
		
		if(supplierPO == null){
			throw new FLException(260049, "供应商不存在");
		}
		
		supplierPO.setStatus(supplierVO.getStatus());
		
		supplierDao.update(supplierPO);
		
		return 0;
	}

}
