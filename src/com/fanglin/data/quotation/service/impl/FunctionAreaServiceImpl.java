/**
 * @File Name		: FunctionAreaServiceImpl.java
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

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.FunctionAreaPO;
import com.fanglin.data.po.QuotationVersionPO;
import com.fanglin.data.quotation.dao.FunctionAreaDao;
import com.fanglin.data.quotation.dao.FunctionAreaItemDao;
import com.fanglin.data.quotation.dao.QuotationVersionDao;
import com.fanglin.data.quotation.service.FunctionAreaService;
import com.fanglin.data.quotation.vo.FunctionAreaVO;
import com.fanglin.data.quotation.vo.QuotationVersionVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("functionAreaService")
@Transactional(readOnly = true)
public class FunctionAreaServiceImpl implements FunctionAreaService {

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private FunctionAreaDao functionAreaDao;

	@Autowired
	private FunctionAreaItemDao functionAreaItemDao;

	@Autowired
	private QuotationVersionDao quotationVersionDao;

	@Autowired
	private CountingService countingService;

	@Override
	public void pageFunctionArea(Paging paging, List<Filter> filters, int company) {

		List<FunctionAreaPO> functionAreaPOs = functionAreaDao.pageFunctionArea(paging, filters, company);
		List<FunctionAreaVO> functionAreaVOs = new ArrayList<FunctionAreaVO>();

		FunctionAreaVO functionAreaVO;

		for (FunctionAreaPO functionAreaPO : functionAreaPOs) {

			functionAreaVO = new FunctionAreaVO(new QuotationVersionVO());

			BeanUtil.copyProperties(functionAreaPO, functionAreaVO, Arrays.asList("version"));

			BeanUtil.copyPropertie(functionAreaPO.getQuotationVersion(), functionAreaVO.getVersion());

			functionAreaVOs.add(functionAreaVO);
		}

		paging.setData(functionAreaVOs);
	}

	@Override
	public FunctionAreaVO queryFunctionAreaByIdAVersionId(FunctionAreaVO functionAreaVO) throws FLException {

		FunctionAreaPO functionAreaPO = functionAreaDao.queryFunctionArea(functionAreaVO.getNo(), functionAreaVO.getVersion().getNo());

		if (functionAreaPO == null) {
			throw new FLException(200012, "功能区不存在");
		}

		functionAreaVO.setVersion(new QuotationVersionVO());

		BeanUtil.copyProperties(functionAreaPO, functionAreaVO, Arrays.asList("version"));

		BeanUtil.copyPropertie(functionAreaPO.getQuotationVersion(), functionAreaVO.getVersion());

		return functionAreaVO;
	}

	@Override
	public List<FunctionAreaVO> queryFunctionAreaByVersionId(FunctionAreaVO functionAreaVO) throws FLException {

		List<FunctionAreaPO> functionAreaPOs = functionAreaDao.queryFunctionArea(functionAreaVO.getVersion().getNo());

		List<FunctionAreaVO> functionAreaVOs = new ArrayList<FunctionAreaVO>();

		for (FunctionAreaPO functionAreaPO : functionAreaPOs) {

			functionAreaVO = new FunctionAreaVO(new QuotationVersionVO());

			BeanUtil.copyProperties(functionAreaPO, functionAreaVO, Arrays.asList("version"));

			BeanUtil.copyPropertie(functionAreaPO.getQuotationVersion(), functionAreaVO.getVersion());

			functionAreaVOs.add(functionAreaVO);
		}

		return functionAreaVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addFunctionArea(FunctionAreaVO functionAreaVO, int company) throws FLException {

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		FunctionAreaPO functionAreaPO = functionAreaDao.queryFunctionArea(functionAreaVO.getNo(), functionAreaVO.getVersion().getNo());

		if (functionAreaPO != null) {
			throw new FLException(200020, "功能区对应版本和编号已存在");
		}

		QuotationVersionPO quotationVersionPO = quotationVersionDao.queryQuotationVersionByVersionId(functionAreaVO.getVersion().getNo());

		if (quotationVersionPO == null) {
			throw new FLException(200022, "报价版本不存在");
		}

		functionAreaPO = new FunctionAreaPO();

		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_QUOTATION_FUNCTION_AREA_INT, CountingPO.COUNTING_DATE_SILNLE_STR, company);

		String no = String.format("%sQA_%s", companyPO.getShortname(), FormatUtil.fillZero(count, "000"));

		functionAreaPO.setNo(no);

		BeanUtil.copyProperties(functionAreaVO, functionAreaPO, Arrays.asList("no", "version"));

		functionAreaPO.setQuotationVersion(quotationVersionPO);
		functionAreaPO.setStatus(FunctionAreaPO.STATUS_ENABLE_INT);

		functionAreaDao.saveOrUpdate(functionAreaPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateFunctionArea(FunctionAreaVO functionAreaVO) throws FLException {

		FunctionAreaPO functionAreaPO = functionAreaDao.get(functionAreaVO.getFaid());

		if (functionAreaPO == null) {
			throw new FLException(200012, "功能区不存在");
		}

		if (!functionAreaPO.getFunctionAreaType().equals(functionAreaVO.getFunctionAreaType())) { // 功能区的类型改变时
			functionAreaItemDao.deleteFunctionAreaItem(functionAreaPO.getFaid());
		}

		BeanUtil.copyProperties(functionAreaVO, functionAreaPO, Arrays.asList("no", "version"));

		functionAreaDao.saveOrUpdate(functionAreaPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateFunctionAreaForStatus(FunctionAreaVO functionAreaVO) throws FLException {

		FunctionAreaPO functionAreaPO = functionAreaDao.get(functionAreaVO.getFaid());

		if (functionAreaPO == null) {
			throw new FLException(200012, "功能区不存在");
		}

		functionAreaPO.setStatus(functionAreaVO.getStatus());

		BeanUtil.copyProperties(functionAreaVO, functionAreaPO, Arrays.asList("no", "version"));

		functionAreaDao.saveOrUpdate(functionAreaPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteFunctionArea(FunctionAreaVO functionAreaVO) {

		functionAreaDao.deleteById(functionAreaVO.getFaid());

		return 0;
	}

}
