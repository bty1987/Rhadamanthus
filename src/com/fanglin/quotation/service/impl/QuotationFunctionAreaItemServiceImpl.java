/**
 * @File Name		: QuotationFunctionAreaItemServiceImpl.java
 * @Package   	: com.fanglin.quotation.service.impl
 * @Version		: 1.0
 * @Date			: 2016-6-6
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.quotation.dao.QuotationItemDao;
import com.fanglin.quotation.dao.ExtensionItemDao;
import com.fanglin.quotation.dao.NormChangeRecordDao;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaItemDao;
import com.fanglin.quotation.dao.SelectionItemDao;
import com.fanglin.quotation.po.NormChangeRecordPO;
import com.fanglin.quotation.po.QuotationFunctionAreaItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.po.SelectionItemPO;
import com.fanglin.quotation.service.QuotationFunctionAreaItemService;
import com.fanglin.quotation.vo.QuotationFunctionAreaItemVO;
import com.fanglin.quotation.vo.QuotationFunctionAreaVO;
import com.fanglin.quotation.vo.QuotationVO;
import com.fanglin.utils.BeanUtil;

@Service("quotationFunctionAreaItemService")
@Transactional(readOnly = true)
public class QuotationFunctionAreaItemServiceImpl implements QuotationFunctionAreaItemService {

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private QuotationFunctionAreaItemDao quotationFunctionAreaItemDao;

	@Autowired
	private QuotationFunctionAreaDao quotationFunctionAreaDao;

	@Autowired
	private ExtensionItemDao extensionItemDao;

	@Autowired
	private SelectionItemDao selectionItemDao;

	@Autowired
	private QuotationItemDao quotationItemDao;

	@Autowired
	private NormChangeRecordDao normChangeRecordDao;

	@Override
	public List<QuotationFunctionAreaItemVO> queryQuotationFunctionAreaItemByQuotationFunctionAreaId(QuotationFunctionAreaItemVO quotationFunctionAreaItemVO) throws FLException {

		QuotationFunctionAreaPO quotationFunctionAreaPO = quotationFunctionAreaDao.get(quotationFunctionAreaItemVO.getQuotationFunctionAreaId());

		List<QuotationFunctionAreaItemPO> quotationFunctionAreaItemPOs = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemByFunctionAreaId(QuotationFunctionAreaItemPO.factoryToClazz(quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaPO.getIndex()), quotationFunctionAreaItemVO.getQuotationFunctionAreaId());

		List<QuotationFunctionAreaItemVO> quotationFunctionAreaItemVOs = new ArrayList<QuotationFunctionAreaItemVO>();

		for (QuotationFunctionAreaItemPO quotationFunctionAreaItemPO : quotationFunctionAreaItemPOs) {

			quotationFunctionAreaItemVO = new QuotationFunctionAreaItemVO();

			BeanUtil.copyProperties(quotationFunctionAreaItemPO, quotationFunctionAreaItemVO);

			if (quotationFunctionAreaItemPO.getQuotationItem() != null) {

				QuotationItemPO quotationItemPO = quotationFunctionAreaItemPO.getQuotationItem();

				quotationFunctionAreaItemVO.setQuotationItemId(quotationItemPO.getQiid());
				quotationFunctionAreaItemVO.setIsRtem(quotationItemPO.getIsRtem());
				quotationFunctionAreaItemVO.setIsImportant(quotationItemPO.getIsImportant());
				quotationFunctionAreaItemVO.setContent(quotationItemPO.getComment());
			}

			quotationFunctionAreaItemVOs.add(quotationFunctionAreaItemVO);
		}

		return quotationFunctionAreaItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public QuotationFunctionAreaItemVO updateQuotationFunctionAreaItem(QuotationFunctionAreaItemVO quotationFunctionAreaItemVO, QuotationVO quotationVO) throws FLException {

		QuotationPO quotationPO = checkQuotationForStatusByEnabled(quotationVO.getQid(), null);

		QuotationServiceImpl.convertQuotationVOToPOForAdvance(quotationVO, quotationPO);

		Long qfaiId = quotationFunctionAreaItemVO.getQfaiId();

		QuotationFunctionAreaPO quotationFunctionAreaPO = quotationFunctionAreaDao.get(quotationFunctionAreaItemVO.getQuotationFunctionAreaId());

		String orderId = quotationPO.getOrderId();
		long areaId = quotationFunctionAreaPO.getQfaId();
		String areaName = quotationFunctionAreaPO.getFunctionAreaName();

		if (qfaiId != null) {

			QuotationFunctionAreaItemPO quotationFunctionAreaItemPO = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemByQfaiId(QuotationFunctionAreaItemPO.factoryToClazz(quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaPO.getIndex()), qfaiId);

			if (quotationFunctionAreaItemPO == null) {
				throw new FLException(200013, "报价项不存在");
			}

			if (extensionItemDao.countExtensionItem(quotationFunctionAreaPO.getQfaId(), qfaiId) > 0) {
				// throw new FLException(200043, "存在关联扩展项");
			}

			quotationFunctionAreaItemPO.setFormula(quotationFunctionAreaItemVO.getFormula());
			quotationFunctionAreaItemPO.setNum(quotationFunctionAreaItemVO.getNum());
			quotationFunctionAreaItemPO.setInitNum(quotationFunctionAreaItemVO.getInitNum());

			quotationFunctionAreaItemDao.update(quotationFunctionAreaItemPO);

			if (quotationFunctionAreaItemPO.getQuotationItem() != null) {

				long qfaiid = quotationFunctionAreaItemPO.getQfaiId();

				SelectionItemPO selectionItemPO = selectionItemDao.querySelectionItem(orderId, areaId, qfaiid, SelectionItemPO.TYPE_QUOTATION_SHORT);

				if (selectionItemPO != null) {

					selectionItemPO.setInitNum(quotationFunctionAreaItemPO.getInitNum());

					if (SelectionItemPO.STATUS_INIT_SHORT != selectionItemPO.getStatus()) {
						selectionItemPO.setNum(quotationFunctionAreaItemPO.getNum());
					}

					selectionItemDao.update(selectionItemPO);
				}
			}

		} else {

			QuotationFunctionAreaItemPO quotationFunctionAreaItemPO = QuotationFunctionAreaItemPO.factoryToInstance(quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaPO.getIndex());

			BeanUtil.copyProperties(quotationFunctionAreaItemVO, quotationFunctionAreaItemPO);

			quotationFunctionAreaItemPO.setQuotationFunctionArea(new QuotationFunctionAreaPO(quotationFunctionAreaItemVO.getQuotationFunctionAreaId()));

			if (Arrays.asList(QuotationFunctionAreaItemPO.TYPE_COMMON_INT, QuotationFunctionAreaItemPO.TYPE_COST_INT, QuotationFunctionAreaItemPO.TYPE_IGNORE_INT, QuotationFunctionAreaItemPO.TYPE_UNACHE_INT, QuotationFunctionAreaItemPO.TYPE_CMPREH_INT).contains(quotationFunctionAreaItemVO.getType())) {

				quotationFunctionAreaItemPO.setQuotationItem(new QuotationItemPO(quotationFunctionAreaItemVO.getQuotationItemId()));
				quotationFunctionAreaItemPO.setContent(null);
			} else {
				quotationFunctionAreaItemPO.setContent(quotationFunctionAreaItemVO.getContent());
				quotationFunctionAreaItemPO.setQuotationItem(null);
			}

			quotationFunctionAreaItemDao.save(quotationFunctionAreaItemPO);

			quotationFunctionAreaItemVO.setQfaiId(quotationFunctionAreaItemPO.getQfaiId());

			long qfaiid = quotationFunctionAreaItemPO.getQfaiId();

			if (extensionItemDao.countExtensionItem(quotationFunctionAreaPO.getQfaId(), qfaiid) > 0) {
				throw new FLException(200043, "存在关联扩展项");
			}

			int count = selectionItemDao.countSelectionItem(orderId, areaId, qfaiid);

			SelectionItemPO selectionItemPO = selectionItemDao.pickSelectionItem(orderId, quotationFunctionAreaItemVO.getQuotationItemId());

			if (count == 0 && selectionItemPO != null) {

				selectionItemPO.setQuoteId(qfaiid);
				selectionItemPO.setQiid(quotationFunctionAreaItemPO.getQuotationItem().getQiid());
				selectionItemPO.setAreaId(areaId);
				selectionItemPO.setAreaName(areaName);
				selectionItemPO.setInitNum(quotationFunctionAreaItemPO.getInitNum());
				selectionItemPO.setNum(quotationFunctionAreaItemPO.getNum());

				selectionItemPO.setType(SelectionItemPO.TYPE_QUOTATION_SHORT);

				selectionItemDao.update(selectionItemPO);
			}
		}

		quotationDao.update(quotationPO);

		return quotationFunctionAreaItemVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationFunctionAreaItemForSpec(QuotationVO quotationVO, QuotationFunctionAreaItemVO quotationFunctionAreaItemVO) throws FLException {

		QuotationPO quotationPO = checkQuotationForStatusByEnabled(quotationVO.getQid(), null);

		List<Short> types = Arrays.asList(QuotationFunctionAreaItemPO.TYPE_TRAFFIC_INT, QuotationFunctionAreaItemPO.TYPE_MANAGE_INT);

		QuotationFunctionAreaPO quotationFunctionAreaPO = quotationFunctionAreaDao.get(quotationFunctionAreaItemVO.getQuotationFunctionAreaId());

		checkQuotationForStatusByEnabled(null, quotationFunctionAreaPO.getQuotation());

		QuotationFunctionAreaItemPO quotationFunctionAreaItemPO = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemByQfaiId(QuotationFunctionAreaItemPO.factoryToClazz(quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaPO.getIndex()), quotationFunctionAreaItemVO.getQfaiId());

		if (quotationFunctionAreaItemPO == null) {
			throw new FLException(200013, "报价项不存在");
		}

		short type = quotationFunctionAreaItemPO.getType();

		if (types.contains(type)) {

			quotationFunctionAreaItemPO.setUnitPrice(quotationFunctionAreaItemVO.getUnitPrice());

			quotationFunctionAreaItemDao.update(quotationFunctionAreaItemPO);
		}

		QuotationServiceImpl.convertQuotationVOToPOForAdvance(quotationVO, quotationPO);

		quotationDao.update(quotationPO);

		return 0;
	}

	// 换绑报价明细行关联报价项(换规格): 同版本+同项目兄弟项, 工程量/公式/位置不动, 价格随新规格刷新; 选材/扩展关联按拍板拦截
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationFunctionAreaItemForFormat(QuotationVO quotationVO, QuotationFunctionAreaItemVO quotationFunctionAreaItemVO, String userId) throws FLException {

		QuotationPO quotationPO = checkQuotationForStatusByEnabled(quotationVO.getQid(), null);

		QuotationFunctionAreaPO quotationFunctionAreaPO = quotationFunctionAreaDao.get(quotationFunctionAreaItemVO.getQuotationFunctionAreaId());

		if (quotationFunctionAreaPO == null) {
			throw new FLException(200012, "功能区不存在");
		}

		QuotationFunctionAreaItemPO quotationFunctionAreaItemPO = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemByQfaiId(QuotationFunctionAreaItemPO.factoryToClazz(quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaPO.getIndex()), quotationFunctionAreaItemVO.getQfaiId());

		if (quotationFunctionAreaItemPO == null || quotationFunctionAreaItemPO.getQuotationItem() == null) {
			throw new FLException(200013, "报价项不存在");
		}

		QuotationItemPO oldItemPO = quotationItemDao.get(quotationFunctionAreaItemPO.getQuotationItem().getQiid());
		QuotationItemPO targetItemPO = quotationItemDao.get(quotationFunctionAreaItemVO.getQuotationItemId());

		if (oldItemPO == null || targetItemPO == null || targetItemPO.getStatus() != QuotationItemPO.STATUS_ENABLE_INT) {
			throw new FLException(200013, "报价项不存在");
		}

		if (targetItemPO.getQiid() == oldItemPO.getQiid()) {
			return 0;
		}

		// 同项目(quotationCtem关联, 任一侧未挂项目按不一致拦截)
		if (oldItemPO.getQuotationCtem() == null || targetItemPO.getQuotationCtem() == null || oldItemPO.getQuotationCtem().getQcid() != targetItemPO.getQuotationCtem().getQcid()) {
			throw new FLException(200073, "报价项与原项目不一致");
		}

		// 同版本(目标项须属于报价单当前版本)
		if (targetItemPO.getQuotationVersion() == null || quotationPO.getVersion() == null || !targetItemPO.getQuotationVersion().getNo().equals(quotationPO.getVersion().getNo())) {
			throw new FLException(200074, "报价项版本与报价单版本不一致");
		}

		// 标准类兜底(与新增分支同清单)
		if (!Arrays.asList(QuotationFunctionAreaItemPO.TYPE_COMMON_INT, QuotationFunctionAreaItemPO.TYPE_COST_INT, QuotationFunctionAreaItemPO.TYPE_IGNORE_INT, QuotationFunctionAreaItemPO.TYPE_UNACHE_INT, QuotationFunctionAreaItemPO.TYPE_CMPREH_INT).contains(targetItemPO.getType())) {
			throw new FLException(200013, "报价项不存在");
		}

		if (extensionItemDao.countExtensionItem(quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaItemPO.getQfaiId()) > 0) {
			throw new FLException(200043, "存在关联扩展项");
		}

		SelectionItemPO selectionItemPO = selectionItemDao.querySelectionItem(quotationPO.getOrderId(), quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaItemPO.getQfaiId(), SelectionItemPO.TYPE_QUOTATION_SHORT);

		if (selectionItemPO != null && selectionItemPO.getStatus() != SelectionItemPO.STATUS_INIT_SHORT) {
			throw new FLException(200075, "报价项已进选材流程,不可更换规格");
		}

		// 换绑报价项+冗余字段随新规格刷新(formula/num/initNum/index/subtype不动)
		quotationFunctionAreaItemPO.setQuotationItem(targetItemPO);
		quotationFunctionAreaItemPO.setItemName(targetItemPO.getName());
		quotationFunctionAreaItemPO.setMeasurementUnit(targetItemPO.getMeasurementUnit().getName());
		quotationFunctionAreaItemPO.setWorkType(targetItemPO.getWorkType().getName());
		quotationFunctionAreaItemPO.setUnitPrice(targetItemPO.getUnitPrice());
		quotationFunctionAreaItemPO.setAddPrice(targetItemPO.getAddPrice());
		quotationFunctionAreaItemPO.setSubPrice(targetItemPO.getSubPrice());
		quotationFunctionAreaItemPO.setDiscount(targetItemPO.getDiscount());
		quotationFunctionAreaItemPO.setType(targetItemPO.getType());
		quotationFunctionAreaItemPO.setContent(null);

		quotationFunctionAreaItemDao.update(quotationFunctionAreaItemPO);

		// 初始态选材项同步引用与预算单价(preprice=单价口径)
		if (selectionItemPO != null) {
			selectionItemPO.setQiid(targetItemPO.getQiid());
			selectionItemPO.setPreprice(targetItemPO.getUnitPrice());
			selectionItemDao.update(selectionItemPO);
		}

		// 变更记录: 报价明细行换绑报价项(换规格)
		normChangeRecordDao.save(new NormChangeRecordPO().init(NormChangeRecordPO.TYPE_QUOTATIONFUNCTIONAREAITEM_QIID_INT, NormChangeRecordPO.CHANGETYPE_UPDATE_INT, userId).refId(quotationFunctionAreaItemPO.getQfaiId()).refNo(targetItemPO.getName()).before(String.format("规格: qfid=%d %s 单价%d", oldItemPO.getQfid(), oldItemPO.getName(), oldItemPO.getUnitPrice())).after(String.format("规格: qfid=%d %s 单价%d", targetItemPO.getQfid(), targetItemPO.getName(), targetItemPO.getUnitPrice())));

		QuotationServiceImpl.convertQuotationVOToPOForAdvance(quotationVO, quotationPO);

		quotationDao.update(quotationPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationFunctionAreaItemByQuotationIdAType(QuotationVO quotationVO, QuotationFunctionAreaItemVO quotationFunctionAreaItemVO) throws FLException {

		List<Short> types = Arrays.asList(QuotationFunctionAreaItemPO.TYPE_TRAFFIC_INT, QuotationFunctionAreaItemPO.TYPE_MANAGE_INT);

		QuotationFunctionAreaPO quotationFunctionAreaPO = quotationFunctionAreaDao.queryQuotationFunctionAreaForTypeByQuotationId(quotationVO.getQid(), QuotationFunctionAreaPO.TYPE_MANAGEMENT_INT);

		checkQuotationForStatusByEnabled(null, quotationFunctionAreaPO.getQuotation());

		QuotationFunctionAreaItemPO quotationFunctionAreaItemPO = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemForTypeByQuotationFunctionAreaId(QuotationFunctionAreaItemPO.factoryToClazz(quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaPO.getIndex()), quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaItemVO.getType());

		if (quotationFunctionAreaItemPO == null) {
			throw new FLException(200013, "报价项不存在");
		}

		short type = quotationFunctionAreaItemPO.getType();

		if (types.contains(type)) {
			quotationFunctionAreaItemPO.setUnitPrice(quotationFunctionAreaItemVO.getUnitPrice());

			quotationFunctionAreaItemDao.update(quotationFunctionAreaItemPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotationFunctionAreaItemForIndex(List<QuotationFunctionAreaItemVO> QuotationFunctionAreaItemVOs, QuotationFunctionAreaVO quotationFunctionAreaVO) throws FLException {

		QuotationFunctionAreaPO quotationFunctionAreaPO = quotationFunctionAreaDao.get(quotationFunctionAreaVO.getQfaId());

		String table = QuotationFunctionAreaItemPO.quotationFunctionAreaItemTableName(quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaPO.getIndex());

		for (QuotationFunctionAreaItemVO quotationFunctionAreaItemVO : QuotationFunctionAreaItemVOs) {

			Long qfaiid = quotationFunctionAreaItemVO.getQfaiId();

			if (qfaiid == null) continue;

			Integer index = quotationFunctionAreaItemVO.getIndex();

			if (index == null) continue;

			quotationFunctionAreaItemDao.updateQuotationFunctionAreaItemForIndex(table, qfaiid, index);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteQuotationFunctionAreaItem(List<Long> qfaiIds, QuotationVO quotationVO, QuotationFunctionAreaVO quotationFunctionAreaVO) throws FLException {

		QuotationPO quotationPO = checkQuotationForStatusByEnabled(quotationVO.getQid(), null);

		if (qfaiIds == null) return 0;

		if (qfaiIds.size() == 0) return 0;

		QuotationFunctionAreaPO quotationFunctionAreaPO = quotationFunctionAreaDao.get(quotationFunctionAreaVO.getQfaId());

		if (quotationFunctionAreaPO == null) {
			throw new FLException(200012, "功能区不存在");
		}

		if (extensionItemDao.countExtensionItem(quotationFunctionAreaPO.getQfaId(), qfaiIds) > 0) {
			throw new FLException(200043, "存在关联扩展项");
		}

		if (selectionItemDao.countSelectionItem(quotationPO.getOrderId(), quotationFunctionAreaPO.getQfaId(), qfaiIds, SelectionItemPO.TYPE_QUOTATION_SHORT) > 0) {
			throw new FLException(200037, "存在关联选材项");
		}

		QuotationServiceImpl.convertQuotationVOToPOForAdvance(quotationVO, quotationPO);

		String tableName = QuotationFunctionAreaItemPO.quotationFunctionAreaItemTable(quotationFunctionAreaPO.getQfaId(), quotationFunctionAreaPO.getIndex());

		quotationFunctionAreaItemDao.deleteQuotationFunctionAreaItemByQfaiIds(tableName, qfaiIds);

		quotationDao.update(quotationPO);

		return 0;
	}

	private QuotationPO checkQuotationForStatusByEnabled(Long qid, QuotationPO quotationPO) throws FLException {

		if (quotationPO == null) {
			quotationPO = quotationDao.get(qid);
		}

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		if (quotationPO.getStatus() != QuotationPO.STATUS_INIT_INT) {
			throw new FLException(200030, "报价不可操作");
		}

		return quotationPO;
	}
}
