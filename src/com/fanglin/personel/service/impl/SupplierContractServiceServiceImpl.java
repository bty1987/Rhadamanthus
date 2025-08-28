package com.fanglin.personel.service.impl;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.SupplierContractServiceDao;
import com.fanglin.personel.po.SupplierContractServicePO;
import com.fanglin.personel.service.SupplierContractServiceService;
import com.fanglin.personel.vo.SupplierContractServiceVO;
import com.fanglin.utils.BeanUtil;

@Service("supplierContractServiceService")
@Transactional(readOnly = true)
public class SupplierContractServiceServiceImpl implements SupplierContractServiceService {

	@Autowired
	private SupplierContractServiceDao supplierContractServiceDao;

	@Override
	public List<SupplierContractServiceVO> querySupplierContractServiceBySid(SupplierContractServiceVO supplierContractServiceVO) {

		List<SupplierContractServicePO> supplierServicePOs = supplierContractServiceDao.querySupplierContractServiceBySid(supplierContractServiceVO.getSid());
		List<SupplierContractServiceVO> supplierServiceVOs = new ArrayList<SupplierContractServiceVO>();

		for (SupplierContractServicePO supplierServicePO : supplierServicePOs) {
			
			SupplierContractServiceVO supplierContractService = new SupplierContractServiceVO();
			BeanUtil.copyPropertie(supplierServicePO,supplierContractService);
			supplierServiceVOs.add(supplierContractService);
		}

		return supplierServiceVOs;
	}
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addSupplierContractService(SupplierContractServiceVO supplierContractService) throws FLException {

		SupplierContractServicePO supplierContractServicePO = new SupplierContractServicePO();

		BeanUtil.copyProperties(supplierContractService, supplierContractServicePO);

		supplierContractServiceDao.save(supplierContractServicePO);
	}
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteSupplierContractService(SupplierContractServiceVO supplierContractService) throws FLException {

		SupplierContractServicePO supplierServicePO = supplierContractServiceDao.get(supplierContractService.getScsid());

		if (supplierServicePO == null) {
			throw new FLException(130077, "厂商服务费不存在");
		}

		supplierContractServiceDao.delete(supplierServicePO);

		return 0;
	}

}
