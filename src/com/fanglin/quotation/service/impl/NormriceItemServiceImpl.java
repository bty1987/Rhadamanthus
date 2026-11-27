package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.dao.ConstructionNodeDao;
import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.data.po.NormaddPO;
import com.fanglin.data.quotation.dao.impl.NormaddDaoImpl;
import com.fanglin.quotation.dao.NormChangeRecordDao;
import com.fanglin.quotation.dao.NormriceItemDao;
import com.fanglin.quotation.dao.NormtionDao;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.NormChangeRecordPO;
import com.fanglin.quotation.po.NormriceItemPO;
import com.fanglin.quotation.po.NormriceItemBase;
import com.fanglin.quotation.po.NormtionPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.service.NormriceItemService;
import com.fanglin.quotation.vo.NormriceItemVO;
import com.fanglin.quotation.vo.NormtionVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("normriceItemService")
@Transactional(readOnly = true)
public class NormriceItemServiceImpl implements NormriceItemService {

	@Autowired
	private NormriceItemDao normriceItemDao;

	@Autowired
	private NormaddDaoImpl normaddDaoImpl;

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private ConstructionNodeDao constructionNodeDao;

	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;

	@Autowired
	private NormChangeRecordDao normChangeRecordDao;

	@Autowired
	private NormtionDao normtionDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	public List<NormriceItemVO> queryNormriceItem(NormriceItemVO normriceItem) {

		int index = resolveIndex(normriceItem.getQid());
		List<NormriceItemBase> normriceItemPOs = normriceItemDao.queryNormriceItem(index, normriceItem.getQid());
		List<NormriceItemVO> normriceItemVOs = new ArrayList<NormriceItemVO>();

		for (NormriceItemBase normriceItemPO : normriceItemPOs) {

			normriceItem = new NormriceItemVO(new ConstructionNodeVO());

			BeanUtil.copyProperties(normriceItemPO, normriceItem, Arrays.asList("constructionNode"));
			BeanUtil.copyPropertie(normriceItemPO.getConstructionNode(), normriceItem.getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

			normriceItemVOs.add(normriceItem);
		}

		return normriceItemVOs;
	}

	@Override
	public List<NormriceItemVO> queryNormriceItemByType(NormriceItemVO normriceItem) {

		int index = resolveIndex(normriceItem.getQid());
		List<NormriceItemBase> normriceItemPOs = normriceItemDao.queryNormriceItemByType(index, normriceItem.getQid(), normriceItem.getType());
		List<NormriceItemVO> normriceItemVOs = new ArrayList<NormriceItemVO>();

		for (NormriceItemBase normriceItemPO : normriceItemPOs) {

			NormriceItemVO normriceItemVO = new NormriceItemVO(new ConstructionNodeVO());

			BeanUtil.copyProperties(normriceItemPO, normriceItemVO, Arrays.asList("constructionNode"));
			BeanUtil.copyPropertie(normriceItemPO.getConstructionNode(), normriceItemVO.getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));

			normriceItemVOs.add(normriceItemVO);
		}

		return normriceItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addNormriceItem(NormtionVO normtionVO, NormriceItemVO normriceItemVO) throws FLException {

		QuotationPO quotationPO = checkQuotationForStatusByEnabled(normtionVO.getQid());

		// 有明细必有单据头: ensure normtion(幂等), 同时取得分表路由 index
		NormtionPO normtionPO = ensureNormtion(normtionVO.getQid(), quotationPO.getOrderId());

		int index = normtionPO.getIndex();

		NormriceItemBase normriceItemPO = NormriceItemPO.factoryToInstance(index);

		if (normriceItemVO.getSid() != null) {

			NormaddPO normaddPO = normaddDaoImpl.get(normriceItemVO.getSid());

			normriceItemPO.setQid(quotationPO.getQid());
			normriceItemPO.setSid(quotationPO.getQid());

			normriceItemPO.setType(NormriceItemBase.TYPE_QUOTA_INT);
			normriceItemPO.setNormtype(NormriceItemBase.NORMTYPE_ADD_INT);
			normriceItemPO.setAtttype(NormriceItemBase.ATTTYPE_COLLECTION_INT);
			normriceItemPO.setNum(normriceItemVO.getNum());

			normriceItemPO.setConstructionNode(normaddPO.getConstructionNode());

			normriceItemPO.setName(normaddPO.getName());
			normriceItemPO.setUnit(normaddPO.getUnit());
			normriceItemPO.setTrannum(1000);
			normriceItemPO.setSalary(normaddPO.getPrice());

			normriceItemDao.save(normriceItemPO);

			normriceItemVO.setConstructionNode(new ConstructionNodeVO());

			BeanUtil.copyProperties(normriceItemPO, normriceItemVO, Arrays.asList("constructionNode"));
			BeanUtil.copyPropertie(normriceItemPO.getConstructionNode(), normriceItemVO.getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));
		} else {

			normriceItemPO.setQid(quotationPO.getQid());

			ConstructionNodePO constructionNodePO = constructionNodeDao.get(normriceItemVO.getConstructionNode().getCnid());

			normriceItemPO.setConstructionNode(constructionNodePO);

			normriceItemPO.setName(normriceItemVO.getName());
			normriceItemPO.setNum(normriceItemVO.getNum());
			normriceItemPO.setTrannum(normriceItemVO.getTrannum());
			normriceItemPO.setSalary(normriceItemVO.getSalary());

			normriceItemPO.setType(NormriceItemBase.TYPE_QUOTA_INT);
			normriceItemPO.setNormtype(NormriceItemBase.NORMTYPE_WORKFEE_INT);
			normriceItemPO.setAtttype(NormriceItemBase.ATTTYPE_COLLECTION_INT);

			normriceItemDao.save(normriceItemPO);

			normriceItemVO.setConstructionNode(new ConstructionNodeVO());

			BeanUtil.copyProperties(normriceItemPO, normriceItemVO, Arrays.asList("constructionNode"));
			BeanUtil.copyPropertie(normriceItemPO.getConstructionNode(), normriceItemVO.getConstructionNode(), Arrays.asList("startSurvey", "endSurvey"));
		}

		// 更新工程计划附加项状态
		updateConstructionScheduleForAdditemStatus(quotationPO, normriceItemPO.getConstructionNode().getCnid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteNormriceItem(NormtionVO normtionVO, NormriceItemVO normriceItemVO) throws FLException {

		// 路由兜底: 前端未传 qid 时按分表序遍历定位行
		IndexedItem indexed = fetchNormriceItem(normriceItemVO.getQid(), normriceItemVO.getNpiid());

		if (indexed == null) {
			return 0;
		}

		// 仅"待确认"状态的附加项允许删除, 保护已确认(计入金额)/已驳回记录
		if (indexed.item.getStatus() != NormriceItemBase.STATUS_INIT_INT) {
			throw new FLException(200063, "附加项状态不可操作");
		}

		QuotationPO quotationPO = checkQuotationForStatusByEnabled(indexed.item.getQid());

		long cnid = indexed.item.getConstructionNode().getCnid();

		normriceItemDao.deleteNormriceItem(indexed.index, indexed.item.getQid(), indexed.item.getType(), indexed.item.getStatus());

		// 更新工程计划附加项状态
		updateConstructionScheduleForAdditemStatus(quotationPO, cnid);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int confirmNormriceItem(NormriceItemVO normriceItemVO, String userId) throws FLException {

		IndexedItem indexed = fetchNormriceItem(normriceItemVO.getQid(), normriceItemVO.getNpiid());

		if (indexed == null) {
			return 0;
		}

		QuotationPO quotationPO = checkQuotationForStatusByEnabled(indexed.item.getQid());

		normriceItemDao.confirmNormriceItem(indexed.index, indexed.item.getQid(), indexed.item.getNpiid(), userId);

		// 更新工程计划附加项状态
		updateConstructionScheduleForAdditemStatus(quotationPO, indexed.item.getConstructionNode().getCnid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int rejectNormriceItem(NormriceItemVO normriceItemVO) throws FLException {

		IndexedItem indexed = fetchNormriceItem(normriceItemVO.getQid(), normriceItemVO.getNpiid());

		if (indexed == null) {
			return 0;
		}

		QuotationPO quotationPO = checkQuotationForStatusByEnabled(indexed.item.getQid());

		normriceItemDao.rejectNormriceItem(indexed.index, indexed.item.getQid(), indexed.item.getNpiid());

		// 更新工程计划附加项状态
		updateConstructionScheduleForAdditemStatus(quotationPO, indexed.item.getConstructionNode().getCnid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateNormriceItemForNum(NormriceItemVO normriceItemVO, String userId) throws FLException {

		IndexedItem indexed = fetchNormriceItem(normriceItemVO.getQid(), normriceItemVO.getNpiid());

		if (indexed == null) {
			return 0;
		}

		if (indexed.item.getStatus() == NormriceItemBase.STATUS_DISABLED_INT) {
			throw new FLException(200137, "定额明细状态不可操作");
		}

		QuotationPO quotationPO = checkQuotationForStatusByEnabled(indexed.item.getQid());

		Integer oldNum = indexed.item.getNum();

		indexed.item.setNum(normriceItemVO.getNum());

		// 已确认附加项数量变更后回退待确认, 重走确认流(计薪口径以确认值为准)
		if (indexed.item.getType() == NormriceItemBase.TYPE_QUOTA_INT && indexed.item.getStatus() == NormriceItemBase.STATUS_CONFIRMED_INT) {
			indexed.item.setStatus(NormriceItemBase.STATUS_INIT_INT);
			indexed.item.setConfirmer(null);
			indexed.item.setConfirmTime(null);
		}

		normriceItemDao.update(indexed.item);

		// 变更记录: 工费项数量修改
		normChangeRecordDao.save(new NormChangeRecordPO().init(NormChangeRecordPO.TYPE_NORMRICEITEM_NUM_INT, NormChangeRecordPO.CHANGETYPE_UPDATE_INT, userId)
				.orderId(quotationPO.getOrderId()).qid(indexed.item.getQid()).refId(indexed.item.getNpiid()).refNo(indexed.item.getName())
				.before(String.format("数量: %s", oldNum))
				.after(String.format("数量: %s", normriceItemVO.getNum())));

		// 更新工程计划附加项状态
		updateConstructionScheduleForAdditemStatus(quotationPO, indexed.item.getConstructionNode().getCnid());

		return 0;
	}

	/**
	 * 根据报价单和施工节点, 更新对应工程计划的附加项状态 有status=0(待确认)的附加项 → additemStatus=1(待审) 没有status=0的附加项 → additemStatus=0(无)
	 */
	private void updateConstructionScheduleForAdditemStatus(QuotationPO quotationPO, long cnid) {

		if (quotationPO == null || quotationPO.getOrderId() == null) {
			return;
		}

		ConstructionSchedulePO schedulePO = constructionScheduleDao.queryConstructionScheduleByOrderId(quotationPO.getOrderId(), cnid);

		if (schedulePO == null) {
			return;
		}

		int index = resolveIndex(quotationPO.getQid());

		int initCount = normriceItemDao.countNormoodItem(index, quotationPO.getQid(), cnid);

		schedulePO.setAdditemStatus(initCount > 0 ? ConstructionSchedulePO.ADDITEMSTATUS_PENDING_INT : ConstructionSchedulePO.ADDITEMSTATUS_NONE_INT);
	}

	private QuotationPO checkQuotationForStatusByEnabled(long qid) throws FLException {

		QuotationPO quotationPO = quotationDao.get(qid);

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		return quotationPO;
	}

	/**
	 * 分表路由解析: qid → normtion.index。normtion 不存在(尚未做过定额操作)按 0(原表)处理。
	 */
	private int resolveIndex(Long qid) {

		if (qid == null) {
			return 0;
		}

		NormtionPO normtionPO = normtionDao.queryNormtion(qid);

		return normtionPO == null ? 0 : normtionPO.getIndex();
	}

	/**
	 * 有明细必有单据头: normtion 不存在时按当前批次(normtionIndex 配置)创建, 返回带 index 的单据头。
	 */
	private NormtionPO ensureNormtion(long qid, String orderId) {

		NormtionPO normtionPO = normtionDao.queryNormtion(qid);

		if (normtionPO != null) {
			return normtionPO;
		}

		normtionPO = new NormtionPO();
		normtionPO.setQid(qid);
		normtionPO.setOrderId(orderId);

		SystemConfigPO indexConfig = systemConfigDao.querySystemConfig("normtionIndex");
		normtionPO.setIndex(indexConfig == null ? 0 : Integer.valueOf(indexConfig.getValue()));
		normtionPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		normtionDao.save(normtionPO);

		return normtionPO;
	}

	/**
	 * 行定位: qid 可用则路由直达; qid 缺失(历史前端只传主键)时按分表序遍历兜底。
	 * 返回 行+所在分表 index; 未命中返回 null。
	 */
	private IndexedItem fetchNormriceItem(Long qid, long npiid) {

		if (qid != null) {
			int index = resolveIndex(qid);
			NormriceItemBase itemPO = normriceItemDao.getNormriceItem(index, npiid);
			return itemPO == null ? null : new IndexedItem(index, itemPO);
		}

		int curIndex = currentBatchIndex();

		for (int index = 0; index <= curIndex; index++) {

			NormriceItemBase itemPO = normriceItemDao.getNormriceItem(index, npiid);

			if (itemPO != null) {
				return new IndexedItem(index, itemPO);
			}
		}

		return null;
	}

	private int currentBatchIndex() {

		SystemConfigPO indexConfig = systemConfigDao.querySystemConfig("normtionIndex");

		return indexConfig == null ? 0 : Integer.valueOf(indexConfig.getValue());
	}

	/** 分表定位结果: index + 行 */
	private static class IndexedItem {

		private final int index;

		private final NormriceItemBase item;

		private IndexedItem(int index, NormriceItemBase item) {
			this.index = index;
			this.item = item;
		}
	}

}
