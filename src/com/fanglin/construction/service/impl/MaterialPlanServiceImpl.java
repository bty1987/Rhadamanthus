package com.fanglin.construction.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.BrandDao;
import com.fanglin.communion.dao.CategoryDao;
import com.fanglin.communion.po.BrandPO;
import com.fanglin.communion.po.CategoryPO;
import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.dao.MaterialPlanDao;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.construction.po.MaterialPlanPO;
import com.fanglin.construction.service.MaterialPlanService;
import com.fanglin.construction.vo.MaterialPlanVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.dao.ConstructionNodeDao;
import com.fanglin.data.common.dao.MaterialPlanNodeDao;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.data.po.MaterialPlanNodePO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.utils.DateUtil;

@Service("materialPlanService")
@Transactional(readOnly = true)
public class MaterialPlanServiceImpl implements MaterialPlanService {

	@Autowired
	private MaterialPlanDao materialPlanDao;

	@Autowired
	private MaterialPlanNodeDao materialPlanNodeDao;

	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;

	@Autowired
	private ConstructionNodeDao constructionNodeDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private BrandDao brandDao;

	@Autowired
	private CategoryDao categoryDao;

	@Override
	public List<MaterialPlanVO> queryMaterialPlanByOrderId(MaterialPlanVO materialPlanVO) throws FLException {

		List<MaterialPlanVO> materialPlanVOs = queryMaterialPlanByOrderIds(Collections.singletonList(materialPlanVO.getOrderId())).get(materialPlanVO.getOrderId());

		return materialPlanVOs == null ? new ArrayList<MaterialPlanVO>() : materialPlanVOs;
	}

	// 批量版: 工程进度列表页按页取多单主材计划汇总用, 5条SQL固定开销不随单数放大
	@Override
	public Map<String, List<MaterialPlanVO>> queryMaterialPlanByOrderIds(List<String> orderIds) {

		Map<String, List<MaterialPlanVO>> resultMap = new HashMap<String, List<MaterialPlanVO>>();

		if (orderIds == null || orderIds.size() == 0) return resultMap;

		List<MaterialPlanPO> materialPlanPOs = materialPlanDao.queryMaterialPlanByOrderIds(orderIds);

		if (materialPlanPOs.size() == 0) return resultMap;

		Map<String, List<MaterialPlanPO>> poMap = new HashMap<String, List<MaterialPlanPO>>();

		for (MaterialPlanPO materialPlanPO : materialPlanPOs) {

			if (!poMap.containsKey(materialPlanPO.getOrderId())) poMap.put(materialPlanPO.getOrderId(), new ArrayList<MaterialPlanPO>());

			poMap.get(materialPlanPO.getOrderId()).add(materialPlanPO);
		}

		Map<String, Map<Long, ConstructionSchedulePO>> scheduleMaps = new HashMap<String, Map<Long, ConstructionSchedulePO>>();

		for (ConstructionSchedulePO constructionSchedulePO : constructionScheduleDao.queryConstructionScheduleByOrderIds(orderIds)) {

			if (constructionSchedulePO.getNode() == null) continue;

			if (!scheduleMaps.containsKey(constructionSchedulePO.getOrderId())) scheduleMaps.put(constructionSchedulePO.getOrderId(), new HashMap<Long, ConstructionSchedulePO>());

			scheduleMaps.get(constructionSchedulePO.getOrderId()).put(constructionSchedulePO.getNode().getCnid(), constructionSchedulePO);
		}

		List<Object[]> salesRows = materialPlanDao.queryMaterialSalesByOrderIds(orderIds);
		List<Object[]> deliveryRows = materialPlanDao.queryMaterialDeliveryByOrderIds(orderIds);
		List<Object[]> selectionRows = materialPlanDao.queryMaterialSelectionByOrderIds(orderIds);

		for (String orderId : poMap.keySet()) {

			List<MaterialPlanPO> orderPlanPOs = poMap.get(orderId);
			Map<Long, ConstructionSchedulePO> scheduleMap = scheduleMaps.get(orderId);

			if (scheduleMap == null) scheduleMap = new HashMap<Long, ConstructionSchedulePO>();

			List<MaterialPlanVO> materialPlanVOs = new ArrayList<MaterialPlanVO>();

			for (MaterialPlanPO materialPlanPO : orderPlanPOs) {

				MaterialPlanVO materialPlan = materialPlanPO.ptv(new MaterialPlanVO());

				ConstructionSchedulePO constructionSchedulePO = scheduleMap.get(materialPlanPO.getCnid());

				materialPlan.setAnchorTime(anchorTime(constructionSchedulePO, materialPlanPO.getAnchor()));

				materialPlan.setPlanTime(materialPlanPO.getManualTime() != null ? materialPlanPO.getManualTime() : offsetTime(materialPlan.getAnchorTime(), materialPlanPO.getOffsetDay()));

				fillFulfillment(materialPlan, salesRows, deliveryRows, selectionRows);

				materialPlan.setOverdue(materialPlan.getPlanTime() != null && materialPlanPO.getStatus() == MaterialPlanPO.STATUS_INIT_INT && materialPlan.getAutoStatus() != null && materialPlan.getAutoStatus() < (short) (materialPlanPO.getAction() + 1) && beforeToday(materialPlan.getPlanTime()) ? (short) 1 : (short) 0);

				materialPlanVOs.add(materialPlan);
			}

			Collections.sort(materialPlanVOs, new Comparator<MaterialPlanVO>() {

				private Map<Long, ConstructionSchedulePO> scheduleMap;

				public Comparator<MaterialPlanVO> setScheduleMap(Map<Long, ConstructionSchedulePO> scheduleMap) {
					this.scheduleMap = scheduleMap;
					return this;
				}

				@Override
				public int compare(MaterialPlanVO o1, MaterialPlanVO o2) {

					long s1 = o1.getCnid() != null && scheduleMap.get(o1.getCnid()) != null ? scheduleMap.get(o1.getCnid()).getSchedule() : Long.MAX_VALUE;
					long s2 = o2.getCnid() != null && scheduleMap.get(o2.getCnid()) != null ? scheduleMap.get(o2.getCnid()).getSchedule() : Long.MAX_VALUE;

					if (s1 != s2) return s1 > s2 ? 1 : -1;

					if (o1.getAction() != null && o2.getAction() != null && !o1.getAction().equals(o2.getAction())) return o1.getAction().compareTo(o2.getAction());

					if (o1.getOffsetDay() != null && o2.getOffsetDay() != null && !o1.getOffsetDay().equals(o2.getOffsetDay())) return o1.getOffsetDay().compareTo(o2.getOffsetDay());

					return o1.getMpid().compareTo(o2.getMpid());
				}
			}.setScheduleMap(scheduleMap));

			resultMap.put(orderId, materialPlanVOs);
		}

		return resultMap;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void makeMaterialPlan(MaterialPlanVO materialPlanVO) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(materialPlanVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		List<ConstructionSchedulePO> constructionSchedulePOs = constructionScheduleDao.queryConstructionScheduleByOrderId(materialPlanVO.getOrderId());

		if (constructionSchedulePOs.size() == 0) {
			throw new FLException(120049, "工程进度不存在,请先放线");
		}

		if (materialPlanDao.countMaterialPlan(materialPlanVO.getOrderId()) > 0) return;

		Map<Long, ConstructionSchedulePO> scheduleMap = new HashMap<Long, ConstructionSchedulePO>();

		for (ConstructionSchedulePO constructionSchedulePO : constructionSchedulePOs) {
			if (constructionSchedulePO.getNode() != null) scheduleMap.put(constructionSchedulePO.getNode().getCnid(), constructionSchedulePO);
		}

		long cid = constructionSchedulePOs.get(0).getCid();

		List<MaterialPlanNodePO> materialPlanNodePOs = materialPlanNodeDao.queryMaterialPlanNode(decorationPO.getCompany());

		for (MaterialPlanNodePO materialPlanNodePO : materialPlanNodePOs) {

			MaterialPlanPO materialPlanPO = new MaterialPlanPO();

			materialPlanPO.setOrderId(materialPlanVO.getOrderId());
			materialPlanPO.setCid(cid);
			materialPlanPO.setRuleId(materialPlanNodePO.getMpnid());

			materialPlanPO.setType(materialPlanNodePO.getType());
			materialPlanPO.setCategoryId(materialPlanNodePO.getCid());
			materialPlanPO.setCategoryName(materialPlanNodePO.getCategoryName());
			materialPlanPO.setBrandId(materialPlanNodePO.getBid());
			materialPlanPO.setBrandName(materialPlanNodePO.getBrandName());

			materialPlanPO.setCnid(materialPlanNodePO.getCnid());
			materialPlanPO.setNodeName(nodeName(scheduleMap, materialPlanNodePO.getCnid(), materialPlanNodePO.getNodeName()));

			materialPlanPO.setAction(materialPlanNodePO.getAction());
			materialPlanPO.setAnchor(materialPlanNodePO.getAnchor());
			materialPlanPO.setOffsetDay(materialPlanNodePO.getOffsetDay());

			materialPlanPO.setStatus(MaterialPlanPO.STATUS_INIT_INT);
			materialPlanPO.setCompany(decorationPO.getCompany());
			materialPlanPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

			materialPlanDao.save(materialPlanPO);
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addMaterialPlan(MaterialPlanVO materialPlanVO, String userId) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(materialPlanVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		List<ConstructionSchedulePO> constructionSchedulePOs = constructionScheduleDao.queryConstructionScheduleByOrderId(materialPlanVO.getOrderId());

		if (constructionSchedulePOs.size() == 0) {
			throw new FLException(120049, "工程进度不存在,请先放线");
		}

		short type = materialPlanVO.getType() == null ? MaterialPlanPO.TYPE_CATEGORY_SHORT : materialPlanVO.getType();

		long cnid = materialPlanVO.getCnid() == null ? 0L : materialPlanVO.getCnid();

		MaterialPlanPO materialPlanPO = new MaterialPlanPO();

		materialPlanPO.setOrderId(materialPlanVO.getOrderId());
		materialPlanPO.setCid(constructionSchedulePOs.get(0).getCid());
		materialPlanPO.setRuleId(0L);
		materialPlanPO.setType(type);
		materialPlanPO.setCnid(cnid);
		materialPlanPO.setNodeName(resolveNodeName(cnid));
		materialPlanPO.setAction(materialPlanVO.getAction() == null ? MaterialPlanPO.ACTION_ORDER_INT : materialPlanVO.getAction());
		materialPlanPO.setAnchor(materialPlanVO.getAnchor() == null ? MaterialPlanPO.ANCHOR_PRE_START_INT : materialPlanVO.getAnchor());
		materialPlanPO.setOffsetDay(materialPlanVO.getOffsetDay() == null ? 0 : materialPlanVO.getOffsetDay());
		materialPlanPO.setManualTime(materialPlanVO.getManualTime());
		materialPlanPO.setComment(materialPlanVO.getComment());
		materialPlanPO.setStatus(MaterialPlanPO.STATUS_INIT_INT);
		materialPlanPO.setCompany(decorationPO.getCompany());
		materialPlanPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		resolveDimension(type, materialPlanVO, materialPlanPO);

		for (MaterialPlanPO existPO : materialPlanDao.queryMaterialPlanByOrderId(materialPlanVO.getOrderId())) {
			if (existPO.getType() == type && existPO.getCnid() == cnid && existPO.getAction() == materialPlanPO.getAction() && existPO.getCategoryId() == materialPlanPO.getCategoryId() && existPO.getBrandId() == materialPlanPO.getBrandId()) {
				throw new FLException(120052, "主材计划已存在");
			}
		}

		materialPlanDao.save(materialPlanPO);

		materialPlanVO.setMpid(materialPlanPO.getMpid());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateMaterialPlan(MaterialPlanVO materialPlanVO) throws FLException {

		MaterialPlanPO materialPlanPO = materialPlanDao.get(materialPlanVO.getMpid());

		if (materialPlanPO == null) {
			throw new FLException(120050, "主材计划不存在");
		}

		if (materialPlanVO.getAnchor() != null) materialPlanPO.setAnchor(materialPlanVO.getAnchor());
		if (materialPlanVO.getOffsetDay() != null) materialPlanPO.setOffsetDay(materialPlanVO.getOffsetDay());
		materialPlanPO.setManualTime(materialPlanVO.getManualTime());
		if (materialPlanVO.getComment() != null) materialPlanPO.setComment(materialPlanVO.getComment());

		materialPlanDao.update(materialPlanPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void confirmMaterialPlan(MaterialPlanVO materialPlanVO, String userId) throws FLException {

		MaterialPlanPO materialPlanPO = materialPlanDao.get(materialPlanVO.getMpid());

		if (materialPlanPO == null) {
			throw new FLException(120050, "主材计划不存在");
		}

		if (materialPlanPO.getStatus() != MaterialPlanPO.STATUS_INIT_INT) {
			throw new FLException(120051, "主材计划已完成,不可操作");
		}

		materialPlanPO.setStatus(MaterialPlanPO.STATUS_CONFIRM_INT);
		materialPlanPO.setActualTime(DateUtil.getDateToTimestamp(new Date()));
		materialPlanPO.setOperater(userId == null || userId.length() == 0 ? 0L : Long.parseLong(userId));

		materialPlanDao.update(materialPlanPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void cancelMaterialPlan(MaterialPlanVO materialPlanVO, String userId) throws FLException {

		MaterialPlanPO materialPlanPO = materialPlanDao.get(materialPlanVO.getMpid());

		if (materialPlanPO == null) {
			throw new FLException(120050, "主材计划不存在");
		}

		if (materialPlanPO.getStatus() == MaterialPlanPO.STATUS_CANCEL_INT) {
			materialPlanPO.setStatus(MaterialPlanPO.STATUS_INIT_INT);
		} else {
			materialPlanPO.setStatus(MaterialPlanPO.STATUS_CANCEL_INT);
		}

		materialPlanPO.setActualTime(null);
		materialPlanPO.setOperater(userId == null || userId.length() == 0 ? 0L : Long.parseLong(userId));

		materialPlanDao.update(materialPlanPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteMaterialPlan(MaterialPlanVO materialPlanVO) throws FLException {

		MaterialPlanPO materialPlanPO = materialPlanDao.get(materialPlanVO.getMpid());

		if (materialPlanPO == null) {
			throw new FLException(120050, "主材计划不存在");
		}

		materialPlanDao.deleteById(materialPlanVO.getMpid());
	}

	// 锚点时间: 实际开完工未发生时回退对应计划时间
	private Timestamp anchorTime(ConstructionSchedulePO constructionSchedulePO, short anchor) {

		if (constructionSchedulePO == null) return null;

		if (anchor == MaterialPlanPO.ANCHOR_PRE_END_INT) return constructionSchedulePO.getPreEndTime();

		if (anchor == MaterialPlanPO.ANCHOR_START_INT) return constructionSchedulePO.getStartTime() != null ? constructionSchedulePO.getStartTime() : constructionSchedulePO.getPreStartTime();

		if (anchor == MaterialPlanPO.ANCHOR_END_INT) return constructionSchedulePO.getEndTime() != null ? constructionSchedulePO.getEndTime() : constructionPlanFallback(constructionSchedulePO);

		return constructionSchedulePO.getPreStartTime();
	}

	private Timestamp constructionPlanFallback(ConstructionSchedulePO constructionSchedulePO) {
		return constructionSchedulePO.getPreEndTime() != null ? constructionSchedulePO.getPreEndTime() : constructionSchedulePO.getPreStartTime();
	}

	private Timestamp offsetTime(Timestamp anchorTime, int offsetDay) {

		if (anchorTime == null) return null;

		Calendar calendar = Calendar.getInstance();
		calendar.setTime(anchorTime);
		calendar.add(Calendar.DAY_OF_MONTH, offsetDay);

		return new Timestamp(calendar.getTime().getTime());
	}

	private boolean beforeToday(Timestamp time) {

		if (time == null) return false;

		Calendar day = Calendar.getInstance();
		day.setTime(time);
		day.set(Calendar.HOUR_OF_DAY, 0);
		day.set(Calendar.MINUTE, 0);
		day.set(Calendar.SECOND, 0);
		day.set(Calendar.MILLISECOND, 0);

		Calendar today = Calendar.getInstance();
		today.set(Calendar.HOUR_OF_DAY, 0);
		today.set(Calendar.MINUTE, 0);
		today.set(Calendar.SECOND, 0);
		today.set(Calendar.MILLISECOND, 0);

		return day.before(today);
	}

	// 系统履约档位: 0未履约 1已下单 2已配送 3已到货; 批量行首列是 orderId 须先比对, 品牌按bid精确匹配, 品类按品类名严格匹配
	private void fillFulfillment(MaterialPlanVO materialPlan, List<Object[]> salesRows, List<Object[]> deliveryRows, List<Object[]> selectionRows) {

		boolean brandDim = materialPlan.getType() != null && materialPlan.getType() == MaterialPlanPO.TYPE_BRAND_SHORT;

		long brandId = materialPlan.getBrandId() == null ? 0L : materialPlan.getBrandId();
		String categoryName = materialPlan.getCategoryName() == null ? "" : materialPlan.getCategoryName().trim();

		short autoStatus = 0;
		Timestamp orderTime = null;
		Timestamp deliverTime = null;
		Timestamp arriveTime = null;
		int salesCount = 0;

		for (Object[] row : salesRows) {

			if (!materialPlan.getOrderId().equals(row[0])) continue;

			if (!hit(brandDim, brandId, categoryName, number(row[4]), null, null, (String) row[3])) continue;

			salesCount++;

			autoStatus = (short) Math.max(autoStatus, 1);

			Timestamp createTime = (Timestamp) row[2];

			if (orderTime == null || (createTime != null && createTime.before(orderTime))) orderTime = createTime;
		}

		for (Object[] row : deliveryRows) {

			if (!materialPlan.getOrderId().equals(row[0])) continue;

			if (!hit(brandDim, brandId, categoryName, number(row[6]), number(row[5]), (String) row[7], null)) continue;

			short status = number(row[2]) == null ? 0 : number(row[2]).shortValue();

			if (status >= 3) {

				autoStatus = (short) Math.max(autoStatus, 3);

				Timestamp confirmTime = (Timestamp) row[4];

				if (arriveTime == null || (confirmTime != null && confirmTime.after(arriveTime))) arriveTime = confirmTime;
			} else if (status >= 1) {

				autoStatus = (short) Math.max(autoStatus, 2);

				Timestamp tranTime = (Timestamp) row[3];

				if (deliverTime == null || (tranTime != null && tranTime.after(deliverTime))) deliverTime = tranTime;
			}
		}

		for (Object[] row : selectionRows) {

			if (!materialPlan.getOrderId().equals(row[0])) continue;

			if (!hit(brandDim, brandId, categoryName, number(row[4]), null, (String) row[5], null)) continue;

			short status = number(row[1]) == null ? 0 : number(row[1]).shortValue();

			if (status >= 3) {

				autoStatus = (short) Math.max(autoStatus, 3);

				Timestamp confirmTime = (Timestamp) row[3];

				if (arriveTime == null || (confirmTime != null && confirmTime.after(arriveTime))) arriveTime = confirmTime;
			} else if (status >= 1) {

				autoStatus = (short) Math.max(autoStatus, 2);

				Timestamp tranTime = (Timestamp) row[2];

				if (deliverTime == null || (tranTime != null && tranTime.after(deliverTime))) deliverTime = tranTime;
			}
		}

		materialPlan.setAutoStatus(autoStatus);
		materialPlan.setAutoTime(autoStatus >= 3 ? arriveTime : autoStatus == 2 ? deliverTime : autoStatus == 1 ? orderTime : null);
		materialPlan.setSalesCount(salesCount);
	}

	// salesHit: brandBid/categoryName; deliverHit: goodsBid/deliveryBid/goodsCategory; selectionHit: goodsBid/goodsCategory
	private boolean hit(boolean brandDim, long brandId, String categoryName, Number goodsBid, Number deliveryBid, String goodsCategory, String salesCategory) {

		if (brandDim) {

			if (deliveryBid != null && deliveryBid.longValue() == brandId) return true;

			return goodsBid != null && goodsBid.longValue() == brandId;
		} else {

			String category = goodsCategory != null ? goodsCategory : salesCategory;

			return category != null && category.trim().equals(categoryName);
		}
	}

	private Number number(Object obj) {
		return obj instanceof Number ? (Number) obj : null;
	}

	private String nodeName(Map<Long, ConstructionSchedulePO> scheduleMap, long cnid, String fallback) {

		ConstructionSchedulePO constructionSchedulePO = scheduleMap.get(cnid);

		if (constructionSchedulePO != null && constructionSchedulePO.getName() != null && constructionSchedulePO.getName().length() > 0) return constructionSchedulePO.getName();

		return fallback == null ? "" : fallback;
	}

	private String resolveNodeName(long cnid) {

		ConstructionNodePO constructionNodePO = constructionNodeDao.get(cnid);

		return constructionNodePO == null ? "" : constructionNodePO.getName();
	}

	// 维度解析: 品牌行 cid 取品牌归属品类; 品类行 bid 固定 0(照 MaterialPlanNodeServiceImpl 同规则)
	private void resolveDimension(short type, MaterialPlanVO materialPlanVO, MaterialPlanPO materialPlanPO) throws FLException {

		if (type == MaterialPlanPO.TYPE_BRAND_SHORT) {

			BrandPO brandPO = brandDao.queryBrandByBid(materialPlanVO.getBrandId() == null ? 0L : materialPlanVO.getBrandId());

			if (brandPO == null) {
				throw new FLException(130077, "品牌不存在");
			}

			if (brandPO.getCategory() == null) {
				throw new FLException(200118, "品类不存在");
			}

			materialPlanPO.setBrandId(brandPO.getBid());
			materialPlanPO.setCategoryId(brandPO.getCategory().getCid());
			materialPlanPO.setCategoryName(brandPO.getCategory().getName());
			materialPlanPO.setBrandName(brandPO.getName());
		} else {

			CategoryPO categoryPO = categoryDao.queryCategoryByCId(materialPlanVO.getCategoryId() == null ? 0L : materialPlanVO.getCategoryId());

			if (categoryPO == null) {
				throw new FLException(200118, "品类不存在");
			}

			materialPlanPO.setBrandId(0L);
			materialPlanPO.setCategoryId(categoryPO.getCid());
			materialPlanPO.setCategoryName(categoryPO.getName());
			materialPlanPO.setBrandName("");
		}
	}

}
