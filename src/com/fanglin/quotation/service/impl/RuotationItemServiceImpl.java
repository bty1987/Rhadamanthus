package com.fanglin.quotation.service.impl;

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

import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.quotation.dao.QuotationItemDao;
import com.fanglin.data.quotation.vo.QuotationItemVO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.quotation.dao.AddReduceDao;
import com.fanglin.quotation.dao.AddReduceItemDao;
import com.fanglin.quotation.dao.ExtensionDao;
import com.fanglin.quotation.dao.ExtensionItemDao;
import com.fanglin.quotation.dao.NormriceItemDao;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaItemDao;
import com.fanglin.quotation.dao.RuotationDao;
import com.fanglin.quotation.dao.RuotationItemDao;
import com.fanglin.quotation.po.AddReduceItemPO;
import com.fanglin.quotation.po.AddReducePO;
import com.fanglin.quotation.po.ExtensionItemPO;
import com.fanglin.quotation.po.ExtensionPO;
import com.fanglin.quotation.po.NormriceItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.po.RuotationItemPO;
import com.fanglin.quotation.po.RuotationPO;
import com.fanglin.quotation.service.RuotationItemService;
import com.fanglin.quotation.vo.QuotationFunctionAreaVO;
import com.fanglin.quotation.vo.RuotationItemVO;
import com.fanglin.quotation.vo.RuotationVO;
import com.fanglin.utils.BeanUtil;

@Service("ruotationItemService")
@Transactional(readOnly = true)
public class RuotationItemServiceImpl implements RuotationItemService{

	@Autowired
	public RuotationDao ruotationDao;

	@Autowired
	public QuotationFunctionAreaDao quotationFunctionAreaDao;

	@Autowired
	public RuotationItemDao ruotationItemDao;

	@Autowired
	public QuotationItemDao quotationItemDao;

	@Autowired
	public QuotationDao quotationDao;

	@Autowired
	public DecorationDao decorationDao;

	@Autowired
	public QuotationFunctionAreaItemDao quotationFunctionAreaItemDao;

	@Autowired
	public NormriceItemDao normriceItemDao;

	@Autowired
	public ExtensionDao extensionDao;

	@Autowired
	public ExtensionItemDao extensionItemDao;

	@Autowired
	public AddReduceDao addReduceDao;

	@Autowired
	public AddReduceItemDao addReduceItemDao;

	@Autowired
	public ConstructionScheduleDao constructionScheduleDao;

	@Override
	public List<RuotationItemVO> queryRuotationItem(RuotationItemVO ruotationItemVO) throws FLException {

		List<RuotationItemPO> ruotationItemPOs = ruotationItemDao.queryRuotationItem(ruotationItemVO.getRuotation().getQrid(), ruotationItemVO.getQuotationFunctionArea().getQfaId());
		List<RuotationItemVO> ruotationItemVOs = new ArrayList<RuotationItemVO>();

		for (RuotationItemPO ruotationItemPO : ruotationItemPOs) {
			ruotationItemVOs.add(ruotationItemPO.ptv(new RuotationItemVO(new RuotationVO(), new QuotationFunctionAreaVO(), new QuotationItemVO())));
		}

		return ruotationItemVOs;
	}

	@Override
	public List<RuotationItemVO> queryRuotationItemForCandidateByOrderId(RuotationItemVO ruotationItemVO) throws FLException {

		String orderId = ruotationItemVO.getRuotation().getDecoration().getOrderId();

		if (decorationDao.queryDecorationByOrderId(orderId) == null) {
			throw new FLException(140013, "装修单不存在");
		}

		List<RuotationItemVO> candidates = new ArrayList<RuotationItemVO>();

		// 节点施工状态: cnid -> status(1开工/2完工), 已开工节点下的项目视为已产生费用
		Map<Long, Short> nodeStatus = new HashMap<Long, Short>();

		for (ConstructionSchedulePO constructionSchedulePO : constructionScheduleDao.queryConstructionScheduleByOrderId(orderId)) {
			if (constructionSchedulePO.getNode() != null) {
				nodeStatus.put(constructionSchedulePO.getNode().getCnid(), constructionSchedulePO.getStatus());
			}
		}

		// 报价源: 默认报价 → 功能区(按分表index分组批量) → 报价项, incur 走工费定额链(qiid→cnid)×节点状态
		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);

		Map<Long, Set<Long>> itemNodes = new HashMap<Long, Set<Long>>();

		if (quotationPO != null) {

			for (NormriceItemPO normriceItemPO : normriceItemDao.queryNormriceItem(quotationPO.getQid())) {

				if (normriceItemPO.getConstructionNode() == null || normriceItemPO.getQiid() == 0) continue;

				Set<Long> nodes = itemNodes.get(normriceItemPO.getQiid());

				if (nodes == null) {
					nodes = new HashSet<Long>();
					itemNodes.put(normriceItemPO.getQiid(), nodes);
				}

				nodes.add(normriceItemPO.getConstructionNode().getCnid());
			}

			List<QuotationFunctionAreaPO> quotationFunctionAreaPOs = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(quotationPO.getQid());

			Map<Short, List<Long>> areaGroups = new HashMap<Short, List<Long>>();

			for (QuotationFunctionAreaPO quotationFunctionAreaPO : quotationFunctionAreaPOs) {

				List<Long> qfaIds = areaGroups.get(quotationFunctionAreaPO.getIndex());

				if (qfaIds == null) {
					qfaIds = new ArrayList<Long>();
					areaGroups.put(quotationFunctionAreaPO.getIndex(), qfaIds);
				}

				qfaIds.add(quotationFunctionAreaPO.getQfaId());
			}

			for (Short index : areaGroups.keySet()) {

				List<Long> qfaIds = areaGroups.get(index);

				List<QuotationFunctionAreaItemPO> quotationFunctionAreaItemPOs = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemByFunctionAreaIds(QuotationFunctionAreaItemPO.factoryToClazz(qfaIds.get(0), index), qfaIds);

				for (QuotationFunctionAreaItemPO quotationFunctionAreaItemPO : quotationFunctionAreaItemPOs) {

					RuotationItemVO candidate = new RuotationItemVO(new RuotationVO(), new QuotationFunctionAreaVO(), new QuotationItemVO());

					candidate.setSource(RuotationItemPO.SOURCE_QUOTATION_INT);
					candidate.setSourceItemId(quotationFunctionAreaItemPO.getQfaiId());
					candidate.setQfaiId(quotationFunctionAreaItemPO.getQfaiId());

					fillCandidate(candidate, quotationFunctionAreaItemPO.getItemName(), quotationFunctionAreaItemPO.getMeasurementUnit(), quotationFunctionAreaItemPO.getWorkType(), quotationFunctionAreaItemPO.getUnitPrice(), quotationFunctionAreaItemPO.getAddPrice(), quotationFunctionAreaItemPO.getSubPrice(), quotationFunctionAreaItemPO.getFormula(), quotationFunctionAreaItemPO.getInitNum(), quotationFunctionAreaItemPO.getNum(), quotationFunctionAreaItemPO.getType(), quotationFunctionAreaItemPO.getSubtype(), quotationFunctionAreaItemPO.getContent(), quotationFunctionAreaItemPO.getIndex());

					if (quotationFunctionAreaItemPO.getQuotationItem() != null) {
						candidate.getQuotationItem().setQiid(quotationFunctionAreaItemPO.getQuotationItem().getQiid());
						candidate.setIncur(judgeIncur(itemNodes.get(quotationFunctionAreaItemPO.getQuotationItem().getQiid()), nodeStatus));
					}

					if (quotationFunctionAreaItemPO.getQuotationFunctionArea() != null) {
						candidate.getQuotationFunctionArea().setQfaId(quotationFunctionAreaItemPO.getQuotationFunctionArea().getQfaId());
					}

					candidates.add(candidate);
				}
			}
		}

		// 扩展源: 扩展单项按eid批量, qiid复用工费定额链判定
		List<ExtensionPO> extensionPOs = extensionDao.queryExtensionByOrderId(orderId);

		if (extensionPOs != null && !extensionPOs.isEmpty()) {

			List<Long> eids = new ArrayList<Long>();

			for (ExtensionPO extensionPO : extensionPOs) {
				eids.add(extensionPO.getEid());
			}

			for (ExtensionItemPO extensionItemPO : extensionItemDao.queryExtensionItem(eids)) {

				RuotationItemVO candidate = new RuotationItemVO(new RuotationVO(), new QuotationFunctionAreaVO(), new QuotationItemVO());

				candidate.setSource(RuotationItemPO.SOURCE_EXTENSION_INT);
				candidate.setSourceItemId(extensionItemPO.getEiid());
				candidate.setQfaiId(extensionItemPO.getQuoteItemId());

				fillCandidate(candidate, extensionItemPO.getItemName(), extensionItemPO.getMeasurementUnit(), extensionItemPO.getWorkType(), extensionItemPO.getUnitPrice(), extensionItemPO.getAddPrice(), extensionItemPO.getSubPrice(), null, extensionItemPO.getInitnum(), extensionItemPO.getNum(), extensionItemPO.getType(), extensionItemPO.getSubtype(), extensionItemPO.getContent(), 0);

				candidate.getQuotationItem().setQiid(extensionItemPO.getQiid());
				candidate.setIncur(judgeIncur(itemNodes.get(extensionItemPO.getQiid()), nodeStatus));

				if (extensionItemPO.getQuotationFunctionArea() != null) {
					candidate.getQuotationFunctionArea().setQfaId(extensionItemPO.getQuotationFunctionArea().getQfaId());
				}

				candidates.add(candidate);
			}
		}

		// 增减源: 增减单项按arid批量, 所属增减单挂施工节点, 节点状态直接判定
		List<AddReducePO> addReducePOs = addReduceDao.queryAddReduceByOrderId(orderId);

		if (addReducePOs != null && !addReducePOs.isEmpty()) {

			Map<Long, AddReducePO> addReducePOMap = new HashMap<Long, AddReducePO>();

			for (AddReducePO addReducePO : addReducePOs) {
				addReducePOMap.put(addReducePO.getArId(), addReducePO);
			}

			for (AddReduceItemPO addReduceItemPO : addReduceItemDao.queryAddReduceItem(new ArrayList<Long>(addReducePOMap.keySet()))) {

				RuotationItemVO candidate = new RuotationItemVO(new RuotationVO(), new QuotationFunctionAreaVO(), new QuotationItemVO());

				candidate.setSource(RuotationItemPO.SOURCE_ADDREDUCE_INT);
				candidate.setSourceItemId(addReduceItemPO.getAriId());
				candidate.setQfaiId(addReduceItemPO.getQuoteItemId());

				fillCandidate(candidate, addReduceItemPO.getItemName(), addReduceItemPO.getMeasurementUnit(), addReduceItemPO.getWorkType(), addReduceItemPO.getUnitPrice(), addReduceItemPO.getAddPrice(), addReduceItemPO.getSubPrice(), null, addReduceItemPO.getInitnum(), addReduceItemPO.getNum(), addReduceItemPO.getType(), addReduceItemPO.getSubtype(), addReduceItemPO.getContent(), addReduceItemPO.getIndex());

				AddReducePO addReducePO = addReducePOMap.get(addReduceItemPO.getArId());

				if (addReducePO != null && addReducePO.getConstructionNode() != null) {
					Short status = nodeStatus.get(addReducePO.getConstructionNode().getCnid());
					candidate.setIncur(status != null && (ConstructionSchedulePO.STATUS_BEGIN_INT == status || ConstructionSchedulePO.STATUS_FINISH_INT == status) ? (short) 1 : (short) 0);
				}

				if (addReduceItemPO.getQuotationFunctionArea() != null) {
					candidate.getQuotationFunctionArea().setQfaId(addReduceItemPO.getQuotationFunctionArea().getQfaId());
				}

				candidates.add(candidate);
			}
		}

		return candidates;
	}

	private void fillCandidate(RuotationItemVO candidate, String itemName, String measurementUnit, String workType, int unitPrice, int addPrice, int subPrice, String formula, int initNum, int num, short type, short subtype, String content, int index) {

		candidate.setItemName(itemName);
		candidate.setMeasurementUnit(measurementUnit);
		candidate.setWorkType(workType);
		candidate.setUnitPrice(unitPrice);
		candidate.setAddPrice(addPrice);
		candidate.setSubPrice(subPrice);
		candidate.setFormula(formula);
		candidate.setInitNum(initNum);
		candidate.setNum(num);
		candidate.setType(type);
		candidate.setSubtype(subtype);
		candidate.setContent(content);
		candidate.setIndex(index);
		candidate.setIncur((short) 0);
	}

	private Short judgeIncur(Set<Long> nodes, Map<Long, Short> nodeStatus) {

		if (nodes == null || nodes.isEmpty()) {
			return (short) 0;
		}

		for (Long cnid : nodes) {

			Short status = nodeStatus.get(cnid);

			if (status != null && (ConstructionSchedulePO.STATUS_BEGIN_INT == status || ConstructionSchedulePO.STATUS_FINISH_INT == status)) {
				return (short) 1;
			}
		}

		return (short) 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public RuotationItemVO updateRuotationItem(RuotationItemVO ruotationItemVO, RuotationVO ruotationVO) throws FLException {

		RuotationPO ruotationPO = ruotationDao.get(ruotationItemVO.getRuotation().getQrid());

		if (ruotationPO == null) {
			throw new FLException(200126, "退报单不存在");
		}

		if (ruotationPO.getStatus() != RuotationPO.STATUS_INIT_INT) {
			throw new FLException(200125, "退报单状态不可操作");
		}

		RuotationItemPO ruotationItemPO = null;

		if (ruotationItemVO.getQriid() == null) {

			ruotationItemPO = new RuotationItemPO();

			QuotationFunctionAreaPO quotationFunctionAreaPO = quotationFunctionAreaDao.get(ruotationItemVO.getQuotationFunctionArea().getQfaId());

			QuotationItemPO quotationItemPO = quotationItemDao.get(ruotationItemVO.getQuotationItem().getQiid());

			BeanUtil.copyProperties(ruotationItemVO, ruotationItemPO, Arrays.asList("ruotation", "quotationFunctionArea", "quotationItem"));

			ruotationItemPO.setRuotation(ruotationPO);
			ruotationItemPO.setQuotationFunctionArea(quotationFunctionAreaPO);
			ruotationItemPO.setQuotationItem(quotationItemPO);

			ruotationItemDao.save(ruotationItemPO);

			ruotationItemVO.setQriid(ruotationItemPO.getQriid());

		} else {

			ruotationItemPO = ruotationItemDao.get(ruotationItemVO.getQriid());

			ruotationItemPO.setFormula(ruotationItemVO.getFormula());
			ruotationItemPO.setInitNum(ruotationItemVO.getInitNum());
			ruotationItemPO.setNum(ruotationItemVO.getNum());

			ruotationItemDao.update(ruotationItemPO);
		}

		ruotationPO.setTotalPrice(ruotationVO.getTotalPrice());

		ruotationDao.update(ruotationPO);

		return ruotationItemVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateRuotationItemForIndex(List<RuotationItemVO> ruotationItemVOs) throws FLException {

		for (RuotationItemVO ruotationItemVO : ruotationItemVOs) {

			RuotationItemPO ruotationItemPO = ruotationItemDao.get(ruotationItemVO.getQriid());

			if (ruotationItemPO.getRuotation().getStatus() != RuotationPO.STATUS_INIT_INT) {
				throw new FLException(200125, "退报单状态不可操作");
			}

			ruotationItemDao.updateRuotationItemForIndex(ruotationItemVO.getQriid(), ruotationItemVO.getIndex());
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteRuotationItem(RuotationItemVO ruotationItemVO, RuotationVO ruotationVO) throws FLException {

		RuotationPO ruotationPO = ruotationDao.get(ruotationVO.getQrid());

		if (ruotationPO == null) {
			throw new FLException(200126, "退报单不存在");
		}

		if (ruotationPO.getStatus() != RuotationPO.STATUS_INIT_INT) {
			throw new FLException(200125, "退报单状态不可操作");
		}

		RuotationItemPO ruotationItemPO = ruotationItemDao.get(ruotationItemVO.getQriid());

		ruotationPO.setTotalPrice(ruotationVO.getTotalPrice());

		ruotationItemDao.delete(ruotationItemPO);

		ruotationDao.update(ruotationPO);

		return 0;
	}

}
