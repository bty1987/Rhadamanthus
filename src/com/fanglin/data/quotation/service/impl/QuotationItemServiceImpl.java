/**
 * @File Name		: QuotationItemServiceImpl.java
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
import com.fanglin.communion.po.QuotationClassificationPO;
import com.fanglin.communion.po.QuotationSmallCategoryPO;
import com.fanglin.communion.po.QuotationTypePO;
import com.fanglin.communion.po.WorkTypePO;
import com.fanglin.communion.vo.MeasurementUnitVO;
import com.fanglin.communion.vo.QuotationBigCategoryVO;
import com.fanglin.communion.vo.QuotationClassificationVO;
import com.fanglin.communion.vo.QuotationSmallCategoryVO;
import com.fanglin.communion.vo.QuotationTypeVO;
import com.fanglin.communion.vo.WorkTypeVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.po.QuotationVersionPO;
import com.fanglin.data.quotation.dao.QuotationItemDao;
import com.fanglin.data.quotation.service.QuotationItemService;
import com.fanglin.data.quotation.vo.QuotationCtemVO;
import com.fanglin.data.quotation.vo.QuotationItemVO;
import com.fanglin.data.quotation.vo.QuotationVersionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("quotationItemService")
@Transactional(readOnly = true)
public class QuotationItemServiceImpl implements QuotationItemService {

	@Autowired
	private QuotationItemDao quotationItemDao;

	@Override
	public void pageQuotationItem(Paging paging, List<Filter> filters, int company) {

		filters.add(new Filter(QuotationItemPO.COLUMN_COMPANY_STR, String.valueOf(company), "eq"));

		List<QuotationItemPO> quotationItemPOs = quotationItemDao.pageQuotationItem(paging, filters);
		List<QuotationItemVO> quotationItemVOs = new ArrayList<QuotationItemVO>();

		for (QuotationItemPO quotationItemPO : quotationItemPOs) {
			quotationItemVOs.add(quotationItemPO.ptv(new QuotationItemVO(new QuotationVersionVO(), new QuotationTypeVO(), new QuotationClassificationVO(), new QuotationBigCategoryVO(), new QuotationSmallCategoryVO(), new WorkTypeVO(), new MeasurementUnitVO(), new QuotationCtemVO(null, null, null, null, null, null))));
		}

		paging.setData(quotationItemVOs);
	}

	@Override
	public void pageQuotationItemByVersionId(Paging paging, List<Filter> filters, QuotationItemVO quotationItemVO) {

		List<QuotationItemVO> quotationItemVOs = new ArrayList<QuotationItemVO>();

		if (quotationItemVO != null) {

			filters.add(new Filter(QuotationItemPO.COLUMN_STATUS_STR, String.valueOf(QuotationItemPO.STATUS_ENABLE_INT), "eq"));
			filters.add(new Filter("versionId", quotationItemVO.getVersion().getNo(), "eq"));

			List<QuotationItemPO> quotationItemPOs = quotationItemDao.pageQuotationItem(paging, filters);

			for (QuotationItemPO quotationItemPO : quotationItemPOs) {
				quotationItemVOs.add(quotationItemPO.ptv(new QuotationItemVO(new QuotationVersionVO(), new QuotationTypeVO(), new QuotationClassificationVO(), new QuotationBigCategoryVO(), new QuotationSmallCategoryVO(), new WorkTypeVO(), new MeasurementUnitVO(), new QuotationCtemVO(null, null, null, null, null, null))));
			}
		}

		paging.setData(quotationItemVOs);
	}

	@Override
	public QuotationItemVO queryQuotationItemByItemIdAVersionId(QuotationItemVO quotationItemVO) throws FLException {

		QuotationItemPO quotationItemPO = quotationItemDao.queryQuotationItemByIdAVersionId(quotationItemVO.getNo(), quotationItemVO.getVersion().getNo());

		if (quotationItemPO != null) {
			quotationItemVO = quotationItemPO.ptv(new QuotationItemVO(new QuotationVersionVO(), new QuotationTypeVO(), new QuotationClassificationVO(), new QuotationBigCategoryVO(), new QuotationSmallCategoryVO(), new WorkTypeVO(), new MeasurementUnitVO(), new QuotationCtemVO(null, null, null, null, null, null)));
		}

		return quotationItemVO;
	}

	@Override
	public QuotationItemVO queryQuotationItemByQiid(QuotationItemVO quotationItemVO) throws FLException {

		QuotationItemPO quotationItemPO = quotationItemDao.get(quotationItemVO.getQiid());

		if (quotationItemPO != null) {
			quotationItemVO = quotationItemPO.ptv(new QuotationItemVO(new QuotationVersionVO(), new QuotationTypeVO(), new QuotationClassificationVO(), new QuotationBigCategoryVO(), new QuotationSmallCategoryVO(), new WorkTypeVO(), new MeasurementUnitVO(), new QuotationCtemVO(null, null, null, null, null, null)));
		}

		return quotationItemVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addQuotationItem(QuotationItemVO quotationItemVO) throws FLException {

		String versionId = quotationItemVO.getVersion().getNo();
		String itemId = quotationItemVO.getNo();

		QuotationItemPO quotationItemPO = quotationItemDao.queryQuotationItemByIdAVersionId(itemId, versionId);

		if ((quotationItemPO != null && quotationItemVO.getQiid() == null) || (quotationItemPO != null && quotationItemVO.getQiid() != quotationItemPO.getQiid())) {
			throw new FLException(200011, String.format("报价版本(%s)的报价编号(%s)已存在", versionId, itemId));
		}

		quotationItemPO = new QuotationItemPO();

		BeanUtil.copyProperties(quotationItemVO, quotationItemPO, Arrays.asList("quotationType", "quotationClassification", "quotationBigCategory", "quotationSmallCategory", "measurementUnit", "workType", "quotationVersion", "quotationCtem"));

		quotationItemPO.setQuotationVersion(new QuotationVersionPO(quotationItemVO.getVersion().getNo()));
		quotationItemPO.setQuotationType(new QuotationTypePO(quotationItemVO.getCategory().getId()));
		quotationItemPO.setQuotationClassification(new QuotationClassificationPO(quotationItemVO.getClassification().getId()));
		quotationItemPO.setQuotationBigCategory(new QuotationBigCategoryPO(quotationItemVO.getBigCategory().getId()));
		quotationItemPO.setQuotationSmallCategory(new QuotationSmallCategoryPO(quotationItemVO.getSmallCategory().getId()));
		quotationItemPO.setMeasurementUnit(new MeasurementUnitPO(quotationItemVO.getUnit().getId()));
		quotationItemPO.setWorkType(new WorkTypePO(quotationItemVO.getWorkType().getId()));

		quotationItemDao.save(quotationItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationItem(QuotationItemVO quotationItemVO) throws FLException {

		QuotationItemPO quotationItemPO = quotationItemDao.get(quotationItemVO.getQiid());

		if (quotationItemPO == null) {
			throw new FLException(200013, "报价项不存在");
		}

		BeanUtil.copyProperties(quotationItemVO, quotationItemPO, Arrays.asList("itemId", "quotationType", "quotationClassification", "quotationBigCategory", "quotationSmallCategory", "measurementUnit", "workType", "quotationVersion", "quotationCtem"));

		quotationItemPO.setQuotationType(new QuotationTypePO(quotationItemVO.getCategory().getId()));
		quotationItemPO.setQuotationClassification(new QuotationClassificationPO(quotationItemVO.getClassification().getId()));
		quotationItemPO.setQuotationBigCategory(new QuotationBigCategoryPO(quotationItemVO.getBigCategory().getId()));
		quotationItemPO.setQuotationSmallCategory(new QuotationSmallCategoryPO(quotationItemVO.getSmallCategory().getId()));
		quotationItemPO.setMeasurementUnit(new MeasurementUnitPO(quotationItemVO.getUnit().getId()));
		quotationItemPO.setWorkType(new WorkTypePO(quotationItemVO.getWorkType().getId()));

		quotationItemDao.update(quotationItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationItemForStatus(QuotationItemVO quotationItemVO) throws FLException {

		QuotationItemPO quotationItemPO = quotationItemDao.get(quotationItemVO.getQiid());

		if (quotationItemPO == null) {
			throw new FLException(200013, "报价项不存在");
		}

		quotationItemPO.setStatus(quotationItemVO.getStatus());

		quotationItemDao.update(quotationItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationItemForDiscount(QuotationItemVO quotationItemVO) throws FLException {

		QuotationItemPO quotationItemPO = quotationItemDao.get(quotationItemVO.getQiid());

		if (quotationItemPO == null) {
			throw new FLException(200013, "报价项不存在");
		}

		quotationItemPO.setDiscount(quotationItemVO.getDiscount());

		quotationItemDao.update(quotationItemPO);

		return 0;
	}

}
