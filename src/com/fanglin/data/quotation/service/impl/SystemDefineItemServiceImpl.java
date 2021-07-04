/**
 * @File Name		: SystemDefineItemServiceImpl.java
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date			: 2014-7-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.po.MeasurementUnitPO;
import com.fanglin.communion.po.QuotationBigCategoryPO;
import com.fanglin.communion.po.WorkTypePO;
import com.fanglin.communion.vo.MeasurementUnitVO;
import com.fanglin.communion.vo.QuotationBigCategoryVO;
import com.fanglin.communion.vo.WorkTypeVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.SystemDefineItemPO;
import com.fanglin.data.quotation.dao.SystemDefineItemDao;
import com.fanglin.data.quotation.service.SystemDefineItemService;
import com.fanglin.data.quotation.vo.SystemDefineItemVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("systemDefineItemService")
@Transactional(readOnly = true)
public class SystemDefineItemServiceImpl implements SystemDefineItemService {

	@Autowired
	private SystemDefineItemDao systemDefineItemDao;

	@Override
	public void pageSystemDefineItem(Paging paging, List<Filter> filters, int company) {

		List<SystemDefineItemPO> systemDefineItemPOs = systemDefineItemDao.pageSystemDefineItem(paging, filters, company);
		List<SystemDefineItemVO> systemDefineItemVOs = new ArrayList<SystemDefineItemVO>();

		for (SystemDefineItemPO systemDefineItemPO : systemDefineItemPOs) {
			systemDefineItemVOs.add(systemDefineItemPO.ptv(new SystemDefineItemVO(new QuotationBigCategoryVO(), new MeasurementUnitVO(), new WorkTypeVO())));
		}

		paging.setData(systemDefineItemVOs);
	}

	@Override
	public SystemDefineItemVO querySystemDefineItemByItemId(SystemDefineItemVO systemDefineItemVO, int company) throws FLException {

		SystemDefineItemPO systemDefineItemPO = systemDefineItemDao.querySystemDefineItem(systemDefineItemVO.getNo(), company);

		if (systemDefineItemPO == null) {
			throw new FLException(200015, "系统自定义报价项不存在");
		}

		return systemDefineItemPO.ptv(new SystemDefineItemVO(new QuotationBigCategoryVO(), new MeasurementUnitVO(), new WorkTypeVO()));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addSystemDefineItem(SystemDefineItemVO systemDefineItemVO, int company) throws FLException {

		SystemDefineItemPO systemDefineItemPO = systemDefineItemDao.querySystemDefineItem(systemDefineItemVO.getNo(), company);

		if (systemDefineItemPO != null) {
			throw new FLException(200009, "系统自定义报价项编号存在");
		}

		systemDefineItemPO = new SystemDefineItemPO();

		BeanUtil.copyProperties(systemDefineItemVO, systemDefineItemPO, Arrays.asList("bigCategory", "unit", "workType"));

		systemDefineItemPO.setQuotationBigCategory(new QuotationBigCategoryPO(systemDefineItemVO.getBigCategory().getId()));
		systemDefineItemPO.setMeasurementUnit(new MeasurementUnitPO(systemDefineItemVO.getUnit().getId()));
		systemDefineItemPO.setWorkType(new WorkTypePO(systemDefineItemVO.getWorkType().getId()));
		systemDefineItemPO.setCompany(company);

		systemDefineItemDao.save(systemDefineItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateSystemDefineItem(SystemDefineItemVO systemDefineItemVO) throws FLException {

		SystemDefineItemPO systemDefineItemPO = systemDefineItemDao.get(systemDefineItemVO.getSdiid());

		if (systemDefineItemPO == null) {
			throw new FLException(200021, "系统自定义报价项不存在");
		}

		systemDefineItemPO.setName((systemDefineItemVO.getName()));
		systemDefineItemPO.setUnitPrice(systemDefineItemVO.getUnitPrice());
		systemDefineItemPO.setComment(systemDefineItemVO.getComment());

		systemDefineItemPO.setQuotationBigCategory(new QuotationBigCategoryPO(systemDefineItemVO.getBigCategory().getId()));
		systemDefineItemPO.setMeasurementUnit(new MeasurementUnitPO(systemDefineItemVO.getUnit().getId()));
		systemDefineItemPO.setWorkType(new WorkTypePO(systemDefineItemVO.getWorkType().getId()));

		systemDefineItemDao.update(systemDefineItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateSystemDefineItemForStatus(SystemDefineItemVO systemDefineItemVO) throws FLException {

		SystemDefineItemPO systemDefineItemPO = systemDefineItemDao.get(systemDefineItemVO.getSdiid());

		if (systemDefineItemPO == null) {
			throw new FLException(200021, "系统自定义报价项不存在");
		}

		systemDefineItemPO.setStatus(systemDefineItemVO.getStatus());

		systemDefineItemDao.update(systemDefineItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateSystemDefineItemForDiscount(SystemDefineItemVO systemDefineItemVO) throws FLException {

		SystemDefineItemPO systemDefineItemPO = systemDefineItemDao.get(systemDefineItemVO.getSdiid());

		if (systemDefineItemPO == null) {
			throw new FLException(200021, "系统自定义报价项不存在");
		}

		systemDefineItemPO.setDiscount(systemDefineItemVO.getDiscount());

		systemDefineItemDao.update(systemDefineItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteSystemDefineItem(SystemDefineItemVO systemDefineItemVO) {

		SystemDefineItemPO systemDefineItemPO = systemDefineItemDao.get(systemDefineItemVO.getSdiid());

		systemDefineItemDao.deleteById(systemDefineItemPO.getSdiid());
	}

}
