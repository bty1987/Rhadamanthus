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
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

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
import com.fanglin.data.common.dao.ConstructionNodeDao;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.data.po.CormoodPO;
import com.fanglin.data.po.CormricePO;
import com.fanglin.data.po.CormtimePO;
import com.fanglin.data.po.NoodsPO;
import com.fanglin.data.po.NormoodPO;
import com.fanglin.data.po.NormricePO;
import com.fanglin.data.po.NormtimePO;
import com.fanglin.data.po.QuotationCtemPO;
import com.fanglin.data.po.QuotationFormatPO;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.po.QuotationPricePO;
import com.fanglin.data.po.QuotationVersionPO;
import com.fanglin.data.quotation.dao.CormoodDao;
import com.fanglin.data.quotation.dao.CormriceDao;
import com.fanglin.data.quotation.dao.CormtimeDao;
import com.fanglin.data.quotation.dao.NormoodDao;
import com.fanglin.data.quotation.dao.NormriceDao;
import com.fanglin.data.quotation.dao.NormtimeDao;
import com.fanglin.data.quotation.dao.QuotationFormatDao;
import com.fanglin.data.quotation.dao.QuotationItemDao;
import com.fanglin.data.quotation.dao.QuotationPriceDao;
import com.fanglin.data.material.dao.NoodsDao;
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

	@Autowired
	private ConstructionNodeDao constructionNodeDao;

	@Autowired
	private NoodsDao noodsDao;

	@Autowired
	private CormriceDao cormriceDao;

	@Autowired
	private CormoodDao cormoodDao;

	@Autowired
	private CormtimeDao cormtimeDao;

	@Autowired
	private NormriceDao normriceDao;

	@Autowired
	private NormoodDao normoodDao;

	@Autowired
	private NormtimeDao normtimeDao;

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

		// 版本关联标识约束: 强关联版本要求报价项必须关联项目(规格)
		if (quotationVersionPO.getRelateFlag() == QuotationVersionPO.RELATEFLAG_REQUIRE_INT && quotationItemPO.getQfid() <= 0) {
			throw new FLException(200080, "报价版本要求关联项目(规格)");
		}

		quotationItemPO.setQuotationVersion(quotationVersionPO);

		quotationItemPO.setQvid(quotationVersionPO.getQvId());
		quotationItemPO.setQuotationType(new QuotationTypePO(quotationItemVO.getCategory().getId()));
		quotationItemPO.setQuotationClassification(new QuotationClassificationPO(quotationItemVO.getClassification().getId()));
		quotationItemPO.setQuotationBigCategory(new QuotationBigCategoryPO(quotationItemVO.getBigCategory().getId()));
		quotationItemPO.setQuotationSmallCategory(new QuotationSmallCategoryPO(quotationItemVO.getSmallCategory().getId()));
		quotationItemPO.setMeasurementUnit(new MeasurementUnitPO(quotationItemVO.getUnit().getId()));
		quotationItemPO.setWorkType(new WorkTypePO(quotationItemVO.getWorkType().getId()));

		// 不强制关联版本允许无名称模板(手动输入名称), ctem仅在选择关联时落
		if (quotationItemVO.getQuotationCtem() != null && quotationItemVO.getQuotationCtem().getQcid() != null) {
			quotationItemPO.setQuotationCtem(new QuotationCtemPO(quotationItemVO.getQuotationCtem().getQcid()));
		}

		quotationItemDao.save(quotationItemPO);

		// 挂规格带出定额: 关联format时, 该规格的定额(cormrice/cormood/cormtime按qfid)复制为该项定额(normrice/normood/normtime, qiid=新项)
		// 引用公司化: cnid/nid优先解析为报价版本公司的归集行(pcnid/pnid=原引用且company=版本公司), 公司行缺失则该条定额忽略(不回退company=0)
		if (quotationItemPO.getQfid() > 0) {

			int company = quotationVersionPO.getCompany();

			List<CormricePO> cormricePOs = cormriceDao.queryCormriceByQfid((long) quotationItemPO.getQfid());
			List<CormoodPO> cormoodPOs = cormoodDao.queryCormoodByQfid((long) quotationItemPO.getQfid());
			List<CormtimePO> cormtimePOs = cormtimeDao.queryCormtimeByQfid((long) quotationItemPO.getQfid());

			// 施工节点批量预查: 引用行(cnid→行) + 非本公司行的版本公司归集行(原cnid→公司行), rice/time共用
			Set<Long> cnids = new HashSet<Long>();
			for (CormricePO cormricePO : cormricePOs) {
				cnids.add(cormricePO.getConstructionNode().getCnid());
			}
			for (CormtimePO cormtimePO : cormtimePOs) {
				cnids.add(cormtimePO.getConstructionNode().getCnid());
			}

			Map<Long, ConstructionNodePO> nodeMap = new HashMap<Long, ConstructionNodePO>();
			Map<Long, ConstructionNodePO> nodeCompanyMap = new HashMap<Long, ConstructionNodePO>();

			if (!cnids.isEmpty()) {

				for (ConstructionNodePO nodePO : constructionNodeDao.queryConstructionNodeByCnids(new ArrayList<Long>(cnids))) {
					nodeMap.put(nodePO.getCnid(), nodePO);
				}

				Set<Long> pcnids = new HashSet<Long>();
				for (ConstructionNodePO nodePO : nodeMap.values()) {
					if (nodePO.getCompany() != company) {
						pcnids.add(nodePO.getCnid());
					}
				}

				if (!pcnids.isEmpty()) {
					for (ConstructionNodePO nodePO : constructionNodeDao.queryConstructionNodeByPcnids(new ArrayList<Long>(pcnids), company)) {
						nodeCompanyMap.put(nodePO.getPcnid(), nodePO);
					}
				}
			}

			for (CormricePO cormricePO : cormricePOs) {

				ConstructionNodePO refNode = nodeMap.get(cormricePO.getConstructionNode().getCnid());

				if (refNode == null) {
					continue;
				}

				if (refNode.getCompany() != company) {
					ConstructionNodePO companyNode = nodeCompanyMap.get(refNode.getCnid());
					if (companyNode == null) {
						continue;
					}
					refNode = companyNode;
				}

				NormricePO normricePO = new NormricePO(quotationItemPO, refNode);
				normricePO.setUnit(cormricePO.getUnit());
				normricePO.setTrannum(cormricePO.getTrannum());
				normricePO.setSalary(cormricePO.getSalary());
				normricePO.setStuff(0);
				normricePO.setStatus(NormricePO.STATUS_VALID_STR);
				normriceDao.save(normricePO);
			}

			// 定材批量预查: 引用行(nid→行) + 非本公司行的版本公司归集行(原nid→公司行)
			Set<Long> nids = new HashSet<Long>();
			for (CormoodPO cormoodPO : cormoodPOs) {
				nids.add(cormoodPO.getNoods().getNid());
			}

			Map<Long, NoodsPO> noodsMap = new HashMap<Long, NoodsPO>();
			Map<Long, NoodsPO> noodsCompanyMap = new HashMap<Long, NoodsPO>();

			if (!nids.isEmpty()) {

				for (NoodsPO noodsPO : noodsDao.queryNoodsByNids(new ArrayList<Long>(nids))) {
					noodsMap.put(noodsPO.getNid(), noodsPO);
				}

				Set<Long> pnids = new HashSet<Long>();
				for (NoodsPO noodsPO : noodsMap.values()) {
					if (noodsPO.getCompany() != company) {
						pnids.add(noodsPO.getNid());
					}
				}

				if (!pnids.isEmpty()) {
					for (NoodsPO noodsPO : noodsDao.queryNoodsByPnids(new ArrayList<Long>(pnids), company)) {
						noodsCompanyMap.put(noodsPO.getPnid(), noodsPO);
					}
				}
			}

			for (CormoodPO cormoodPO : cormoodPOs) {

				NoodsPO refNoods = noodsMap.get(cormoodPO.getNoods().getNid());

				if (refNoods == null) {
					continue;
				}

				if (refNoods.getCompany() != company) {
					NoodsPO companyNoods = noodsCompanyMap.get(refNoods.getNid());
					if (companyNoods == null) {
						continue;
					}
					refNoods = companyNoods;
				}

				NormoodPO normoodPO = new NormoodPO(quotationItemPO);
				normoodPO.setNoods(refNoods);
				normoodPO.setName(cormoodPO.getName());
				normoodPO.setNormunit(cormoodPO.getNormunit());
				normoodPO.setNormnum(cormoodPO.getNormnum());
				normoodPO.setStoreunit(cormoodPO.getStoreunit());
				normoodPO.setStorenum(cormoodPO.getStorenum());
				normoodPO.setPrice(cormoodPO.getPrice());
				normoodPO.setStatus(NormoodPO.STATUS_VALID_STR);
				normoodDao.save(normoodPO);
			}

			for (CormtimePO cormtimePO : cormtimePOs) {

				ConstructionNodePO refNode = nodeMap.get(cormtimePO.getConstructionNode().getCnid());

				if (refNode == null) {
					continue;
				}

				if (refNode.getCompany() != company) {
					ConstructionNodePO companyNode = nodeCompanyMap.get(refNode.getCnid());
					if (companyNode == null) {
						continue;
					}
					refNode = companyNode;
				}

				NormtimePO normtimePO = new NormtimePO(quotationItemPO, refNode);
				normtimePO.setUnit(cormtimePO.getUnit());
				normtimePO.setTrannum(cormtimePO.getTrannum());
				normtimePO.setWorkdays(cormtimePO.getWorkdays());
				normtimePO.setStatus(NormtimePO.STATUS_VALID_STR);
				normtimeDao.save(normtimePO);
			}
		}

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

		// 版本关联标识约束: 强关联版本下未挂规格的报价项不可保存
		if (quotationItemPO.getQuotationVersion() != null && quotationItemPO.getQuotationVersion().getRelateFlag() == QuotationVersionPO.RELATEFLAG_REQUIRE_INT && quotationItemPO.getQfid() <= 0) {
			throw new FLException(200080, "报价版本要求关联项目(规格)");
		}

		BeanUtil.copyProperties(quotationItemVO, quotationItemPO, Arrays.asList("itemId", "qfid", "quotationType", "quotationClassification", "quotationBigCategory", "quotationSmallCategory", "measurementUnit", "workType", "quotationVersion", "quotationCtem"));

		quotationItemPO.setQuotationType(new QuotationTypePO(quotationItemVO.getCategory().getId()));
		quotationItemPO.setQuotationClassification(new QuotationClassificationPO(quotationItemVO.getClassification().getId()));
		quotationItemPO.setQuotationBigCategory(new QuotationBigCategoryPO(quotationItemVO.getBigCategory().getId()));
		quotationItemPO.setQuotationSmallCategory(new QuotationSmallCategoryPO(quotationItemVO.getSmallCategory().getId()));
		quotationItemPO.setMeasurementUnit(new MeasurementUnitPO(quotationItemVO.getUnit().getId()));
		quotationItemPO.setWorkType(new WorkTypePO(quotationItemVO.getWorkType().getId()));

		// 未重选名称(无ctem关联)时保留原名称模板不动
		if (quotationItemVO.getQuotationCtem() != null && quotationItemVO.getQuotationCtem().getQcid() != null) {
			quotationItemPO.setQuotationCtem(new QuotationCtemPO(quotationItemVO.getQuotationCtem().getQcid()));
		}

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
