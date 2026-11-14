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
import com.fanglin.data.po.QuotationCtemPO;
import com.fanglin.data.po.QuotationFormatPO;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.po.QuotationPricePO;
import com.fanglin.data.po.QuotationVersionPO;
import com.fanglin.data.quotation.dao.QuotationFormatDao;
import com.fanglin.data.quotation.dao.QuotationItemDao;
import com.fanglin.data.quotation.dao.QuotationPriceDao;
import com.fanglin.data.quotation.dao.QuotationVersionDao;
import com.fanglin.data.quotation.service.QuotationItemService;
import com.fanglin.data.quotation.vo.QuotationCtemVO;
import com.fanglin.data.quotation.vo.QuotationItemVO;
import com.fanglin.data.quotation.vo.QuotationPriceVO;
import com.fanglin.data.quotation.vo.QuotationVersionVO;
import com.fanglin.quotation.dao.NormChangeRecordDao;
import com.fanglin.quotation.po.NormChangeRecordPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("quotationItemService")
@Transactional(readOnly = true)
public class QuotationItemServiceImpl implements QuotationItemService {

	@Autowired
	private QuotationItemDao quotationItemDao;

	@Autowired
	private QuotationFormatDao quotationFormatDao;

	@Autowired
	private NormChangeRecordDao normChangeRecordDao;

	@Autowired
	private QuotationVersionDao quotationVersionDao;

	@Autowired
	private QuotationPriceDao quotationPriceDao;

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

		if (quotationItemVO == null) return;

		filters.add(new Filter(QuotationItemPO.COLUMN_STATUS_STR, String.valueOf(QuotationItemPO.STATUS_ENABLE_INT), "eq"));
		filters.add(new Filter("versionId", quotationItemVO.getVersion().getNo(), "eq"));

		List<QuotationItemPO> quotationItemPOs = quotationItemDao.pageQuotationItem(paging, filters);

		for (QuotationItemPO quotationItemPO : quotationItemPOs) {
			quotationItemVOs.add(quotationItemPO.ptv(new QuotationItemVO(new QuotationVersionVO(), new QuotationTypeVO(), new QuotationClassificationVO(), new QuotationBigCategoryVO(), new QuotationSmallCategoryVO(), new WorkTypeVO(), new MeasurementUnitVO(), new QuotationCtemVO(null, null, null, null, null, null))));
		}

		paging.setData(quotationItemVOs);
	}

	@Override
	public void pageQuotationItemForPrice(Paging paging, List<Filter> filters, QuotationItemVO quotationItemVO, QuotationPriceVO quotationPriceVO) {

		List<QuotationItemVO> quotationItemVOs = new ArrayList<QuotationItemVO>();

		if (quotationItemVO == null) return;

		if (quotationPriceVO == null) return;

		List<QuotationPricePO> quotationPricePOs = quotationPriceDao.pageQuotationPrice(paging, filters, quotationItemVO.getVersion().getNo(), quotationPriceVO.getUpdateTime(), quotationItemVO.getType());

		for (QuotationPricePO quotationPricePO : quotationPricePOs) {
			quotationItemVOs.add(quotationPricePO.ptv(new QuotationItemVO(new QuotationVersionVO(), new QuotationTypeVO(), new QuotationClassificationVO(), new QuotationBigCategoryVO(), new QuotationSmallCategoryVO(), new WorkTypeVO(), new MeasurementUnitVO(), new QuotationCtemVO(null, null, null, null, null, null))));
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
	public List<QuotationItemVO> queryQuotationItemForFormatByQiid(QuotationItemVO quotationItemVO) throws FLException {

		QuotationItemPO quotationItemPO = quotationItemDao.get(quotationItemVO.getQiid());

		if (quotationItemPO == null) {
			throw new FLException(200013, "报价项不存在");
		}

		List<QuotationItemVO> formatVOs = new ArrayList<QuotationItemVO>();

		for (QuotationItemPO formatPO : quotationItemDao.queryQuotationItemForFormatByQiid(quotationItemVO.getQiid())) {

			QuotationItemVO formatVO = formatPO.ptv(new QuotationItemVO(new QuotationVersionVO(), new QuotationTypeVO(), new QuotationClassificationVO(), new QuotationBigCategoryVO(), new QuotationSmallCategoryVO(), new WorkTypeVO(), new MeasurementUnitVO(), new QuotationCtemVO(null, null, null, null, null, null)));

			if (formatPO.getQfid() > 0) {

				// 候选个位数规模, 明细组装非统计; get须long强转(DaoImpl.get(Serializable)装箱陷阱)
				QuotationFormatPO quotationFormatPO = quotationFormatDao.get((long) formatPO.getQfid());

				if (quotationFormatPO != null) {
					formatVO.setFormatName(quotationFormatPO.getName());
				}
			}

			formatVOs.add(formatVO);
		}

		return formatVOs;
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

		QuotationVersionPO quotationVersionPO = quotationVersionDao.queryQuotationVersionByVersionId(quotationItemVO.getVersion().getNo());

		if (quotationVersionPO == null) {
			throw new FLException(200022, "报价版本不存在");
		}

		quotationItemPO.setQuotationVersion(quotationVersionPO);

		quotationItemPO.setQvid(quotationVersionPO.getQvId());
		quotationItemPO.setQuotationType(new QuotationTypePO(quotationItemVO.getCategory().getId()));
		quotationItemPO.setQuotationClassification(new QuotationClassificationPO(quotationItemVO.getClassification().getId()));
		quotationItemPO.setQuotationBigCategory(new QuotationBigCategoryPO(quotationItemVO.getBigCategory().getId()));
		quotationItemPO.setQuotationSmallCategory(new QuotationSmallCategoryPO(quotationItemVO.getSmallCategory().getId()));
		quotationItemPO.setMeasurementUnit(new MeasurementUnitPO(quotationItemVO.getUnit().getId()));
		quotationItemPO.setWorkType(new WorkTypePO(quotationItemVO.getWorkType().getId()));
		quotationItemPO.setQuotationCtem(new QuotationCtemPO(quotationItemVO.getQuotationCtem().getQcid()));

		quotationItemDao.save(quotationItemPO);

		QuotationPricePO quotationPricePO = new QuotationPricePO();

		quotationPricePO.setQuotationItem(quotationItemPO);

		quotationPricePO.setAddPrice(quotationItemPO.getAddPrice());
		quotationPricePO.setUnitPrice(quotationItemPO.getUnitPrice());
		quotationPricePO.setSubPrice(quotationItemPO.getSubPrice());

		quotationPricePO.setCreateTime(DateUtil.getDateToTimestamp(DateUtil.parseDate("2015-01-01 00:00:00", "yyyy-MM-dd hh:mm:ss")));
		quotationPricePO.setUpdateTime(DateUtil.getDateToTimestamp(DateUtil.parseDate("2015-01-01 00:00:00", "yyyy-MM-dd hh:mm:ss")));

		quotationPriceDao.save(quotationPricePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationItem(QuotationItemVO quotationItemVO) throws FLException {

		QuotationItemPO quotationItemPO = quotationItemDao.get(quotationItemVO.getQiid());

		if (quotationItemPO == null) {
			throw new FLException(200013, "报价项不存在");
		}

		BeanUtil.copyProperties(quotationItemVO, quotationItemPO, Arrays.asList("itemId", "qfid", "quotationType", "quotationClassification", "quotationBigCategory", "quotationSmallCategory", "measurementUnit", "workType", "quotationVersion", "quotationCtem"));

		quotationItemPO.setQuotationType(new QuotationTypePO(quotationItemVO.getCategory().getId()));
		quotationItemPO.setQuotationClassification(new QuotationClassificationPO(quotationItemVO.getClassification().getId()));
		quotationItemPO.setQuotationBigCategory(new QuotationBigCategoryPO(quotationItemVO.getBigCategory().getId()));
		quotationItemPO.setQuotationSmallCategory(new QuotationSmallCategoryPO(quotationItemVO.getSmallCategory().getId()));
		quotationItemPO.setMeasurementUnit(new MeasurementUnitPO(quotationItemVO.getUnit().getId()));
		quotationItemPO.setWorkType(new WorkTypePO(quotationItemVO.getWorkType().getId()));
		quotationItemPO.setQuotationCtem(new QuotationCtemPO(quotationItemVO.getQuotationCtem().getQcid()));

		quotationItemDao.update(quotationItemPO);

		return 0;
	}

	// 变更记录受控接口: 报价项关联规格换绑(原仅运维SQL, 通道=updateQuotationItem明确排除qfid)
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationItemForQfid(QuotationItemVO quotationItemVO, String userId) throws FLException {

		QuotationItemPO quotationItemPO = quotationItemDao.get(quotationItemVO.getQiid());

		if (quotationItemPO == null) {
			throw new FLException(200013, "报价项不存在");
		}

		if (quotationItemVO.getQfid() == null || quotationFormatDao.get(quotationItemVO.getQfid()) == null) {
			throw new FLException(200070, "报价规格不存在");
		}

		int oldQfid = quotationItemPO.getQfid();

		if (oldQfid == quotationItemVO.getQfid()) return 0;

		quotationItemPO.setQfid(quotationItemVO.getQfid());

		quotationItemDao.update(quotationItemPO);

		// 变更记录: 报价项关联规格换绑
		normChangeRecordDao.save(new NormChangeRecordPO().init(NormChangeRecordPO.TYPE_QUOTATIONITEM_QFID_INT, NormChangeRecordPO.CHANGETYPE_UPDATE_INT, userId).refId(quotationItemPO.getQiid()).refNo(quotationItemPO.getName()).before(String.format("关联规格: qfid=%d", oldQfid)).after(String.format("关联规格: qfid=%d", quotationItemVO.getQfid())));

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

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationItemForImportant(QuotationItemVO quotationItemVO) throws FLException {

		QuotationItemPO quotationItemPO = quotationItemDao.get(quotationItemVO.getQiid());

		if (quotationItemPO == null) {
			throw new FLException(200013, "报价项不存在");
		}

		quotationItemPO.setIsImportant(quotationItemVO.getIsImportant() == null ? QuotationItemPO.ISIMPORTANT_NONE_INT : quotationItemVO.getIsImportant().shortValue());

		quotationItemDao.update(quotationItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationItemForFormula(QuotationItemVO quotationItemVO) throws FLException {

		QuotationItemPO quotationItemPO = quotationItemDao.get(quotationItemVO.getQiid());

		if (quotationItemPO == null) {
			throw new FLException(200013, "报价项不存在");
		}

		quotationItemPO.setFormula(quotationItemVO.getFormula());

		quotationItemDao.update(quotationItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationItemForCost(QuotationItemVO quotationItemVO) throws FLException {

		QuotationItemPO quotationItemPO = quotationItemDao.get(quotationItemVO.getQiid());

		if (quotationItemPO == null) {
			throw new FLException(200013, "报价项不存在");
		}

		quotationItemPO.setCost(quotationItemVO.getCost());
		quotationItemPO.setAchePrice(quotationItemVO.getAchePrice());

		quotationItemDao.update(quotationItemPO);

		return 0;
	}

}
