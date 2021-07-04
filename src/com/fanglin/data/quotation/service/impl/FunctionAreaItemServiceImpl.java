package com.fanglin.data.quotation.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.MeasurementUnitVO;
import com.fanglin.communion.vo.QuotationBigCategoryVO;
import com.fanglin.communion.vo.QuotationClassificationVO;
import com.fanglin.communion.vo.QuotationSmallCategoryVO;
import com.fanglin.communion.vo.QuotationTypeVO;
import com.fanglin.communion.vo.WorkTypeVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.FunctionAreaItemPO;
import com.fanglin.data.po.FunctionAreaPO;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.quotation.dao.FunctionAreaDao;
import com.fanglin.data.quotation.dao.FunctionAreaItemDao;
import com.fanglin.data.quotation.service.FunctionAreaItemService;
import com.fanglin.data.quotation.vo.FunctionAreaItemVO;
import com.fanglin.data.quotation.vo.FunctionAreaVO;
import com.fanglin.data.quotation.vo.QuotationItemVO;
import com.fanglin.data.quotation.vo.QuotationVersionVO;
import com.fanglin.utils.BeanUtil;

@Service("functionAreaItemService")
@Transactional(readOnly = true)
public class FunctionAreaItemServiceImpl implements FunctionAreaItemService {

	@Autowired
	private FunctionAreaItemDao functionAreaItemDao;

	@Autowired
	private FunctionAreaDao functionAreaDao;

	@Override
	public List<FunctionAreaItemVO> queryFunctionAreaItemByFunctionAreaId(FunctionAreaItemVO functionAreaItemVO) {

		long functionAreaId = functionAreaItemVO.getFunctionArea().getFaid();

		List<FunctionAreaItemPO> functionAreaItemPOs = functionAreaItemDao.queryFunctionAreaItemByFunctionAreaId(functionAreaId);
		List<FunctionAreaItemVO> functionAreaItemVOs = new ArrayList<FunctionAreaItemVO>();

		for (FunctionAreaItemPO functionAreaItemPO : functionAreaItemPOs) {

			FunctionAreaPO functionAreaPO = functionAreaItemPO.getFunctionArea();
			QuotationItemPO quotationItemPO = functionAreaItemPO.getQuotationItem();

			FunctionAreaVO functionAreaVO = new FunctionAreaVO(new QuotationVersionVO());

			functionAreaVO.setFaid(functionAreaPO.getFaid());
			functionAreaVO.setNo(functionAreaPO.getNo());
			functionAreaVO.setName(functionAreaPO.getName());

			BeanUtil.copyPropertie(functionAreaPO.getQuotationVersion(), functionAreaVO.getVersion());

			functionAreaItemVO = new FunctionAreaItemVO();

			functionAreaItemVO.setFaiid(functionAreaItemPO.getFaiid());
			functionAreaItemVO.setFormula(functionAreaItemPO.getFormula());
			functionAreaItemVO.setFunctionArea(functionAreaVO);

			functionAreaItemVO.setQuotationItem(quotationItemPO.ptv(new QuotationItemVO(new QuotationVersionVO(), new QuotationTypeVO(), new QuotationClassificationVO(), new QuotationBigCategoryVO(), new QuotationSmallCategoryVO(), new WorkTypeVO(), new MeasurementUnitVO())));

			functionAreaItemVOs.add(functionAreaItemVO);
		}

		return functionAreaItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addFunctionAreaItem(FunctionAreaVO functionAreaVO, List<FunctionAreaItemVO> functionAreaItems) throws FLException {

		long faid = functionAreaVO.getFaid();

		FunctionAreaPO functionAreaPO = functionAreaDao.get(faid);

		if (functionAreaPO == null) {
			throw new FLException(200010, String.format("功能区不存在"));
		}

		for (FunctionAreaItemVO functionAreaItemVO : functionAreaItems) {

			long qiid = functionAreaItemVO.getQuotationItem().getQiid();

			FunctionAreaItemPO functionAreaItemPO = functionAreaItemDao.queryFunctionAreaItemByIdAFunctionAreaId(faid, qiid);

			if (functionAreaItemPO != null)
				continue;

			functionAreaItemPO = new FunctionAreaItemPO();

			functionAreaItemPO.setFunctionArea(functionAreaPO);
			functionAreaItemPO.setQuotationItem(new QuotationItemPO(functionAreaItemVO.getQuotationItem().getQiid()));

			functionAreaItemDao.save(functionAreaItemPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateFunctionAreaItem(FunctionAreaItemVO functionAreaItemVO) throws FLException {

		FunctionAreaItemPO functionAreaItemPO = functionAreaItemDao.get(functionAreaItemVO.getFaiid());

		if (functionAreaItemPO == null) {
			throw new FLException(200010, "功能区不存在");
		}
		
		functionAreaItemPO.setFormula(functionAreaItemVO.getFormula());

		functionAreaItemDao.update(functionAreaItemPO);
	}
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteFunctionAreaItemByIds(List<Long> qfiids) {

		for (Long qfiid : qfiids) {
			functionAreaItemDao.deleteById(qfiid);
		}

		return 0;
	}

}
