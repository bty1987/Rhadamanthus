package com.fanglin.inventory.service.impl;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.WorkTypeVO;
import com.fanglin.construction.dao.ConstructionAccessoryDao;
import com.fanglin.construction.dao.ConstructionDao;
import com.fanglin.construction.po.ConstructionAccessoryPO;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.material.dao.NoodsDao;
import com.fanglin.data.material.vo.AccessoriesTypeVO;
import com.fanglin.data.material.vo.GoodsVO;
import com.fanglin.data.po.NoodsPO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.inventory.dao.AccessoriesDao;
import com.fanglin.inventory.dao.AccessoriesItemDao;
import com.fanglin.inventory.po.AccessoriesItemPO;
import com.fanglin.inventory.po.AccessoriesPO;
import com.fanglin.inventory.service.AccessoriesItemService;
import com.fanglin.inventory.vo.AccessoriesItemVO;
import com.fanglin.inventory.vo.AccessoriesVO;
import com.fanglin.quotation.dao.NormoodItemDao;
import com.fanglin.quotation.dao.NormtionDao;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.NormtionPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.utils.Arith;

@Service("accessoriesItemService")
@Transactional(readOnly = true)
public class AccessoriesItemServiceImpl implements AccessoriesItemService {

	private static final Logger logger = LoggerFactory.getLogger(AccessoriesItemServiceImpl.class);

	@Autowired
	private AccessoriesItemDao accessoriesItemDao;

	@Autowired
	private AccessoriesDao accessoriesDao;

	@Autowired
	private ConstructionDao constructionDao;

	@Autowired
	private ConstructionAccessoryDao constructionAccessoryDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private NormtionDao normtionDao;

	@Autowired
	private NormoodItemDao normoodItemDao;

	@Autowired
	private NoodsDao noodsDao;

	@Override
	public List<AccessoriesItemVO> queryAccessoriesItemByAid(AccessoriesItemVO accessoriesItemVO) {

		List<AccessoriesItemPO> accessoriesItemPOs = accessoriesItemDao.queryAccessoriesItem(accessoriesItemVO.getAid());
		List<AccessoriesItemVO> accessoriesItemVOs = new ArrayList<AccessoriesItemVO>();

		for (AccessoriesItemPO accessoriesItemPO : accessoriesItemPOs) {
			accessoriesItemVOs.add(accessoriesItemPO.ptv(new AccessoriesItemVO(new GoodsVO(new AccessoriesTypeVO(new WorkTypeVO())))));
		}

		return accessoriesItemVOs;
	}

	@Override
	public List<AccessoriesItemVO> queryAccessoriesItemByAids(List<Long> aids) {

		List<AccessoriesItemPO> accessoriesItemPOs = accessoriesItemDao.queryAccessoriesItem(aids);
		List<AccessoriesItemVO> accessoriesItemVOs = new ArrayList<AccessoriesItemVO>();

		for (AccessoriesItemPO accessoriesItemPO : accessoriesItemPOs) {
			accessoriesItemVOs.add(accessoriesItemPO.ptv(new AccessoriesItemVO(new GoodsVO())));
		}

		return accessoriesItemVOs;
	}

	@Override
	public List<AccessoriesItemVO> queryAccessoriesItemByOrderId(AccessoriesVO accessoriesVO) {

		List<?> accessoriesItemPOs = accessoriesItemDao.queryAccessoriesItem(accessoriesVO.getOrderId());
		List<AccessoriesItemVO> accessoriesItemVOs = new ArrayList<AccessoriesItemVO>();

		for (Object item : accessoriesItemPOs) {
			accessoriesItemVOs.add(((AccessoriesItemPO) item).ptv(new AccessoriesItemVO(new GoodsVO())));
		}

		return accessoriesItemVOs;
	}

	@Override
	public long checkAccessoriesItem(AccessoriesVO accessoriesVO, AccessoriesItemVO accessoriesItemVO) throws FLException {

		String orderId = accessoriesVO.getOrderId();
		long nid = accessoriesItemVO.getNid();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		NormtionPO normtionPO = normtionDao.queryNormtion(quotationPO.getQid());

		if (normtionPO == null) return 0;

		if (normtionPO.getStatus() != NormtionPO.STATUS_INIT_INT) return 0;

		NoodsPO noodsPO = noodsDao.get(nid);

		if (noodsPO == null) {
			throw new FLException(130118, "定材不存在");
		}

		if (noodsPO.getCalc() != NoodsPO.CALC_CACL_INT) return 0;

		long normamount = normoodItemDao.amountNormoodItem(quotationPO.getQid(), accessoriesItemVO.getNid());
		long acceamount = accessoriesItemDao.amountAccessoriesItem(orderId, accessoriesItemVO.getNid());

		normamount = Arith.round(normamount, 0, Arith.ROUND_UP);

		// 量纲口径: 已领与本次领用均按(num×storenum)÷1000 折算到×1000口径,与定额侧同量纲;storenum 未传按 1:1 兜底,防前端缺参 NPE
		long storenum = accessoriesItemVO.getStorenum() == null ? 1000L : accessoriesItemVO.getStorenum().longValue();
		long cost = Arith.div(Arith.mul(accessoriesItemVO.getNum(), storenum), 1000L);

		logger.info("checkAccessoriesItem orderId={} nid={} num={} storenum={} acceamount={} cost={} normamount={} surplus={}", orderId, nid, accessoriesItemVO.getNum(), storenum, acceamount, cost, normamount, noodsPO.getSurplus());

		if (Arith.add(acceamount, cost) > Arith.add(normamount, noodsPO.getSurplus())) {
			throw new FLException(260082, "辅料项总额已达上限");
		}

		return Arith.sub(normamount, Arith.add(acceamount, cost));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addAccessoriesItem(AccessoriesVO accessoriesVO, AccessoriesItemVO accessoriesItemVO) throws FLException {

		AccessoriesPO accessoriesPO = accessoriesDao.get(accessoriesVO.getAid());

		if (accessoriesPO == null) {
			throw new FLException(260023, "辅料单不存在");
		}

		if (accessoriesPO.getStatus() != AccessoriesPO.STATUS_INIT_INT) {
			throw new FLException(260024, "辅料单状态不可操作");
		}

		if (accessoriesItemVO.getSchedule() != null && accessoriesPO.getSchedule() != accessoriesItemVO.getSchedule()) throw new FLException(260072, "施工节点不匹配");

		if (accessoriesItemVO.getNid() != null) {
			checkAccessoriesItem(accessoriesVO, accessoriesItemVO);
		}

		accessoriesPO.setTotal(Arith.add(accessoriesPO.getTotal(), accessoriesItemVO.getTotal()));

		accessoriesDao.update(accessoriesPO);

		AccessoriesItemPO accessoriesItemPO = new AccessoriesItemPO().init(accessoriesVO.getAid(), accessoriesItemVO);

		accessoriesItemDao.save(accessoriesItemPO);

		accessoriesItemVO.setAiid(accessoriesItemPO.getAiid());

		if (accessoriesVO.getType() == AccessoriesPO.TYPE_POST_INT) { // 售后类型辅料单不需要处理工程单和工程辅料
			return 0;
		}

		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(accessoriesPO.getOrderId());

		long total = accessoriesItemVO.getTotal();

		if (Arith.add(constructionPO.getAccessoryTotal(), total) > constructionPO.getAccessoryLimit()) {
			throw new FLException(260058, "辅料总额已达上限");
		}

		constructionPO.setAccessoryTotal(Arith.add(constructionPO.getAccessoryTotal(), accessoriesItemVO.getTotal()));
		constructionDao.update(constructionPO);

		ConstructionAccessoryPO constructionAccessoryPO = constructionAccessoryDao.queryConstructionAccessory(constructionPO.getCid(), accessoriesItemVO.getGoods().getGid());

		if (constructionAccessoryPO == null) return 0;
		if (constructionAccessoryPO.getCheckup() != ConstructionAccessoryPO.CHECKUP_VERIFY_SHORT) return 0;

		if (Arith.add(constructionAccessoryPO.getNum(), accessoriesItemVO.getNum()) > constructionAccessoryPO.getNumLimit()) {
			throw new FLException(260059, "辅料总数已达上限");
		}

		constructionAccessoryPO.setTotal(Arith.add(constructionAccessoryPO.getTotal(), total));
		constructionAccessoryPO.setNum(Arith.add(constructionAccessoryPO.getNum(), accessoriesItemVO.getNum()));

		constructionAccessoryDao.update(constructionAccessoryPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateAccessoriesItem(AccessoriesItemVO accessoriesItemVO) throws FLException {

		AccessoriesItemPO accessoriesItemPO = accessoriesItemDao.get(accessoriesItemVO.getAiid());

		if (accessoriesItemPO == null) {
			throw new FLException(260025, "辅料项不存在");
		}

		AccessoriesPO accessoriesPO = accessoriesDao.get(accessoriesItemPO.getAid());

		if (accessoriesPO.getStatus() != AccessoriesPO.STATUS_INIT_INT) {
			throw new FLException(260024, "辅料单状态不可操作");
		}
		long totals = Arith.mul(accessoriesItemPO.getSelling(), accessoriesItemPO.getNum());
		int num = Arith.sub(accessoriesItemVO.getNum(), accessoriesItemPO.getNum());
		long total = Arith.sub(accessoriesItemVO.getTotal(), totals);

		accessoriesItemPO.setNum(accessoriesItemVO.getNum());
		accessoriesItemPO.setSurplus(accessoriesItemVO.getNum());

		accessoriesItemDao.update(accessoriesItemPO);

		accessoriesPO.setTotal(Arith.add(accessoriesPO.getTotal(), total));

		accessoriesDao.update(accessoriesPO);

		if (accessoriesPO.getType() == AccessoriesPO.TYPE_POST_INT) { // 售后类型辅料单不需要处理工程单和工程辅料
			return 0;
		}

		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(accessoriesPO.getOrderId());

		if (Arith.add(constructionPO.getAccessoryTotal(), total) > constructionPO.getAccessoryLimit()) {
			throw new FLException(260058, "辅料总额已达上限");
		}

		constructionPO.setAccessoryTotal(Arith.add(constructionPO.getAccessoryTotal(), total));
		constructionDao.update(constructionPO);

		ConstructionAccessoryPO constructionAccessoryPO = constructionAccessoryDao.queryConstructionAccessory(constructionPO.getCid(), accessoriesItemPO.getGoods().getGid());

		if (constructionAccessoryPO == null) return 0;
		if (constructionAccessoryPO.getCheckup() != ConstructionAccessoryPO.CHECKUP_VERIFY_SHORT) return 0;

		if (Arith.add(constructionAccessoryPO.getNum(), num) > constructionAccessoryPO.getNumLimit()) {
			throw new FLException(260059, "辅料总数已达上限");
		}

		constructionAccessoryPO.setTotal(Arith.add(constructionAccessoryPO.getTotal(), total));
		constructionAccessoryPO.setNum(Arith.add(constructionAccessoryPO.getNum(), num));

		constructionAccessoryDao.update(constructionAccessoryPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteAccessoriesItem(AccessoriesItemVO accessoriesItemVO) throws FLException {

		AccessoriesItemPO accessoriesItemPO = accessoriesItemDao.get(accessoriesItemVO.getAiid());

		if (accessoriesItemPO == null) {
			throw new FLException(260025, "辅料项不存在");
		}

		AccessoriesPO accessoriesPO = accessoriesDao.get(accessoriesItemPO.getAid());

		if (accessoriesPO.getStatus() != AccessoriesPO.STATUS_INIT_INT) {
			throw new FLException(260024, "辅料单状态不可操作");
		}

		long total = Arith.mul(accessoriesItemPO.getSelling(), accessoriesItemPO.getNum());

		accessoriesPO.setTotal(Arith.sub(accessoriesPO.getTotal(), total));

		accessoriesDao.update(accessoriesPO);

		accessoriesItemDao.delete(accessoriesItemPO); // 删除前置,与 addAccessoriesItem 对称,确保售后类型辅料单也能删除

		if (accessoriesPO.getType() == AccessoriesPO.TYPE_POST_INT) { // 售后类型辅料单不需要处理工程单和工程辅料
			return 0;
		}

		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(accessoriesPO.getOrderId());

		constructionPO.setAccessoryTotal(Arith.sub(constructionPO.getAccessoryTotal(), total));
		constructionDao.update(constructionPO);

		ConstructionAccessoryPO constructionAccessoryPO = constructionAccessoryDao.queryConstructionAccessory(constructionPO.getCid(), accessoriesItemPO.getGoods().getGid());

		if (constructionAccessoryPO != null) {
			constructionAccessoryPO.setTotal(Arith.sub(constructionAccessoryPO.getTotal(), total));
			constructionAccessoryPO.setNum(Arith.sub(constructionAccessoryPO.getNum(), accessoriesItemPO.getNum()));

			constructionAccessoryDao.update(constructionAccessoryPO);
		}

		return 0;
	}

}
