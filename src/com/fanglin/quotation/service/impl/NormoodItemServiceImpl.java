package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.material.dao.NoodsDao;
import com.fanglin.data.material.vo.NoodsVO;
import com.fanglin.data.po.NoodsPO;
import com.fanglin.data.po.NormpackItemPO;
import com.fanglin.data.quotation.dao.impl.NormpackItemDaoImpl;
import com.fanglin.quotation.dao.NormoodItemDao;
import com.fanglin.quotation.dao.NormChangeRecordDao;
import com.fanglin.quotation.dao.NormtionDao;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.NormChangeRecordPO;
import com.fanglin.quotation.po.NormoodItemPO;
import com.fanglin.quotation.po.NormoodItemBase;
import com.fanglin.quotation.po.NormtionPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.service.NormoodItemService;
import com.fanglin.quotation.vo.NormoodItemVO;
import com.fanglin.quotation.vo.QuotationVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("normoodItemService")
@Transactional(readOnly = true)
public class NormoodItemServiceImpl implements NormoodItemService {

	@Autowired
	private NormoodItemDao normoodItemDao;

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private NormtionDao normtionDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private NormpackItemDaoImpl normpackItemDaoImpl;

	@Autowired
	private NoodsDao noodsDao;

	@Autowired
	private NormChangeRecordDao normChangeRecordDao;

	@Override
	public List<NormoodItemVO> queryNormoodItem(NormoodItemVO normoodItem) {

		int index = resolveIndex(normoodItem.getQid());
		List<NormoodItemBase> normoodItemPOs = normoodItemDao.queryNormoodItem(index, normoodItem.getQid());
		List<NormoodItemVO> normoodItemVOs = new ArrayList<NormoodItemVO>();

		for (NormoodItemBase normoodItemPO : normoodItemPOs) {

			normoodItem = new NormoodItemVO(new NoodsVO());

			BeanUtil.copyProperties(normoodItemPO, normoodItem, Arrays.asList("noods"));
			BeanUtil.copyPropertie(normoodItemPO.getNoods(), normoodItem.getNoods());

			normoodItemVOs.add(normoodItem);
		}

		return normoodItemVOs;
	}

	@Override
	public int amountNormoodItem(NormoodItemVO normoodItemVO) {

		int index = resolveIndex(normoodItemVO.getQid());
		long amount = normoodItemDao.amountNormoodItem(index, normoodItemVO.getQid(), normoodItemVO.getNoods().getNid());

		normoodItemVO.setAmount(amount);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public List<NormoodItemVO> addNormoodItem(QuotationVO quotationVO, List<NormoodItemVO> normoodItemVOs, String userId) throws FLException {

		QuotationPO quotationPO = quotationDao.get(quotationVO.getQid());

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		// 有明细必有单据头: ensure normtion(幂等), 同时取得分表路由 index
		NormtionPO normtionPO = ensureNormtion(quotationPO.getQid(), quotationPO.getOrderId());

		int index = normtionPO.getIndex();

		List<NormpackItemPO> normpackItems = new ArrayList<NormpackItemPO>();

		for (NormoodItemVO normoodItemVO : normoodItemVOs) {

			if (normoodItemVO.getSid() != null) {

				List<NormpackItemPO> normpackItemPOs = normpackItemDaoImpl.queryNormpackItem(normoodItemVO.getSid());

				normpackItems.addAll(normpackItemPOs);

			} else {

				normpackItems = null;

				normoodItemVOs = new ArrayList<NormoodItemVO>();

				NormoodItemBase normoodItemPO = NormoodItemPO.factoryToInstance(index);

				normoodItemPO.setQid(quotationPO.getQid());

				normoodItemPO.setType(NormoodItemBase.TYPE_QUOTA_INT);
				normoodItemPO.setNormtype(NormoodItemBase.NORMTYPE_MATERIAL_INT);
				normoodItemPO.setAtttype(NormoodItemBase.ATTTYPE_COLLECTION_INT);

				normoodItemPO.setNormunit(normoodItemVO.getNormunit());
				normoodItemPO.setNormnum(normoodItemVO.getNormnum());
				normoodItemPO.setStoreunit(normoodItemVO.getStoreunit());
				normoodItemPO.setStorenum(normoodItemVO.getStorenum());

				NoodsPO noodsPO = noodsDao.get(normoodItemVO.getNoods().getNid());

				normoodItemPO.setNoods(noodsPO);

				normoodItemDao.save(normoodItemPO);

				normoodItemVO = new NormoodItemVO(new NoodsVO());

				BeanUtil.copyProperties(normoodItemPO, normoodItemVO, Arrays.asList("noods"));
				BeanUtil.copyPropertie(normoodItemPO.getNoods(), normoodItemVO.getNoods());

				normoodItemVOs.add(normoodItemVO);
			}
		}

		if (normpackItems == null || normpackItems.size() == 0) {
			// 变更记录: 下定材添加(单条/自定)
			normChangeRecordDao.save(new NormChangeRecordPO().init(NormChangeRecordPO.TYPE_NORMOODITEM_INT, NormChangeRecordPO.CHANGETYPE_ADD_INT, userId)
					.qid(quotationPO.getQid()).refId(quotationPO.getQid()).refNo(quotationPO.getOrderId())
					.after(String.format("添加下定材 %d 行", normoodItemVOs.size())));
			return normoodItemVOs;
		}

		normoodItemVOs = new ArrayList<NormoodItemVO>();

		for (NormpackItemPO normpackItemPO : normpackItems) {

			NormoodItemBase normoodItemPO = NormoodItemPO.factoryToInstance(index);

			normoodItemPO.setQid(quotationPO.getQid());
			normoodItemPO.setSid(quotationPO.getQid());

			normoodItemPO.setType(NormoodItemBase.TYPE_QUOTA_INT);
			normoodItemPO.setNormtype(NormoodItemBase.NORMTYPE_PACK_INT);
			normoodItemPO.setAtttype(NormoodItemBase.ATTTYPE_COLLECTION_INT);

			if (normpackItemPO.getNoods() != null) {
				normoodItemPO.setNoods(new NoodsPO(normpackItemPO.getNoods().getNid()));
			}

			normoodItemPO.setNormunit(normpackItemPO.getNormunit());
			normoodItemPO.setNormnum(normpackItemPO.getNormnum());
			normoodItemPO.setStoreunit(normpackItemPO.getStoreunit());
			normoodItemPO.setStorenum(normpackItemPO.getStorenum());
			normoodItemPO.setNoods(normpackItemPO.getNoods());

			normoodItemDao.save(normoodItemPO);

			NormoodItemVO normoodItemVO = new NormoodItemVO(new NoodsVO());

			BeanUtil.copyProperties(normoodItemPO, normoodItemVO, Arrays.asList("noods"));
			BeanUtil.copyPropertie(normoodItemPO.getNoods(), normoodItemVO.getNoods());

			normoodItemVOs.add(normoodItemVO);
		}

		// 变更记录: 下定材添加(套餐展开)
		normChangeRecordDao.save(new NormChangeRecordPO().init(NormChangeRecordPO.TYPE_NORMOODITEM_INT, NormChangeRecordPO.CHANGETYPE_ADD_INT, userId)
				.qid(quotationPO.getQid()).refId(quotationPO.getQid()).refNo(quotationPO.getOrderId())
				.after(String.format("添加下定材(套餐展开) %d 行", normoodItemVOs.size())));

		return normoodItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteNormoodItem(NormoodItemVO normoodItemVO, String userId) throws FLException {

		// 路由兜底: 前端未传 qid 时按分表序遍历定位行
		IndexedItem indexed = fetchNormoodItem(normoodItemVO.getQid(), normoodItemVO.getNgiid());

		// 守卫: 不存在幂等返回(原实现此处为空 if 体直接硬删)
		if (indexed == null) {
			return 0;
		}

		NormoodItemBase normoodItemPO = indexed.item;

		// 变更记录: 下定材删除(行快照)
		String noodsName = normoodItemPO.getNoods() != null ? normoodItemPO.getNoods().getName() : "---";

		normChangeRecordDao.save(new NormChangeRecordPO().init(NormChangeRecordPO.TYPE_NORMOODITEM_INT, NormChangeRecordPO.CHANGETYPE_DELETE_INT, userId)
				.qid(normoodItemPO.getQid()).refId(normoodItemPO.getNgiid()).refNo(noodsName)
				.before(String.format("定材: %s, 定额数量: %s, 库房数量: %s", noodsName, normoodItemPO.getNormnum(), normoodItemPO.getStorenum())));

		normoodItemDao.deleteNormoodItem(indexed.index, normoodItemPO.getQid(), normoodItemPO.getNgiid(), normoodItemPO.getType());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateNormoodItemForNum(NormoodItemVO normoodItemVO, String userId) throws FLException {

		// 路由兜底: 前端未传 qid 时按分表序遍历定位行
		IndexedItem indexed = fetchNormoodItem(normoodItemVO.getQid(), normoodItemVO.getNgiid());

		if (indexed == null) {
			return 0;
		}

		NormoodItemBase normoodItemPO = indexed.item;

		if (normoodItemPO.getStatus() == NormoodItemBase.STATUS_DISABLED_INT) {
			throw new FLException(200137, "定额明细状态不可操作");
		}

		QuotationPO quotationPO = quotationDao.get(normoodItemPO.getQid());

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		Integer oldNormnum = normoodItemPO.getNormnum();
		Integer oldStorenum = normoodItemPO.getStorenum();

		normoodItemPO.setNormnum(normoodItemVO.getNormnum());
		normoodItemPO.setStorenum(normoodItemVO.getStorenum());

		normoodItemDao.update(normoodItemPO);

		// 变更记录: 下定材数量修改(行快照)
		String noodsName = normoodItemPO.getNoods() != null ? normoodItemPO.getNoods().getName() : "---";

		normChangeRecordDao.save(new NormChangeRecordPO().init(NormChangeRecordPO.TYPE_NORMOODITEM_INT, NormChangeRecordPO.CHANGETYPE_UPDATE_INT, userId)
				.qid(normoodItemPO.getQid()).refId(normoodItemPO.getNgiid()).refNo(noodsName)
				.before(String.format("定额数量: %s, 库房数量: %s", oldNormnum, oldStorenum))
				.after(String.format("定额数量: %s, 库房数量: %s", normoodItemVO.getNormnum(), normoodItemVO.getStorenum())));

		return 0;
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
	 */
	private IndexedItem fetchNormoodItem(Long qid, long ngiid) {

		if (qid != null) {
			int index = resolveIndex(qid);
			NormoodItemBase itemPO = normoodItemDao.getNormoodItem(index, ngiid);
			return itemPO == null ? null : new IndexedItem(index, itemPO);
		}

		int curIndex = currentBatchIndex();

		for (int index = 0; index <= curIndex; index++) {

			NormoodItemBase itemPO = normoodItemDao.getNormoodItem(index, ngiid);

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

		private final NormoodItemBase item;

		private IndexedItem(int index, NormoodItemBase item) {
			this.index = index;
			this.item = item;
		}
	}

}
