package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.BrandDao;
import com.fanglin.communion.dao.CategoryDao;
import com.fanglin.communion.po.BrandPO;
import com.fanglin.communion.po.CategoryPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.ConstructionNodeDao;
import com.fanglin.data.common.dao.MaterialPlanNodeDao;
import com.fanglin.data.common.service.MaterialPlanNodeService;
import com.fanglin.data.common.vo.MaterialPlanNodeVO;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.data.po.MaterialPlanNodePO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("materialPlanNodeService")
@Transactional(readOnly = true)
public class MaterialPlanNodeServiceImpl implements MaterialPlanNodeService {

	@Autowired
	private MaterialPlanNodeDao materialPlanNodeDao;

	@Autowired
	private BrandDao brandDao;

	@Autowired
	private CategoryDao categoryDao;

	@Autowired
	private ConstructionNodeDao constructionNodeDao;

	@Override
	public void pageMaterialPlanNode(Paging paging, List<Filter> filters, int company) {

		List<MaterialPlanNodePO> materialPlanNodePOs = materialPlanNodeDao.pageMaterialPlanNode(paging, filters, company);
		List<MaterialPlanNodeVO> materialPlanNodeVOs = new ArrayList<MaterialPlanNodeVO>();

		for (MaterialPlanNodePO materialPlanNodePO : materialPlanNodePOs) {
			materialPlanNodeVOs.add(materialPlanNodePO.ptv(new MaterialPlanNodeVO()));
		}

		paging.setData(materialPlanNodeVOs);
	}

	@Override
	public List<MaterialPlanNodeVO> queryMaterialPlanNode(int company) {

		List<MaterialPlanNodePO> materialPlanNodePOs = materialPlanNodeDao.queryMaterialPlanNode(company);
		List<MaterialPlanNodeVO> materialPlanNodeVOs = new ArrayList<MaterialPlanNodeVO>();

		for (MaterialPlanNodePO materialPlanNodePO : materialPlanNodePOs) {
			materialPlanNodeVOs.add(materialPlanNodePO.ptv(new MaterialPlanNodeVO()));
		}

		return materialPlanNodeVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addMaterialPlanNode(MaterialPlanNodeVO materialPlanNodeVO, int company, String userId) throws FLException {

		short type = materialPlanNodeVO.getType() == null ? MaterialPlanNodePO.TYPE_CATEGORY_SHORT : materialPlanNodeVO.getType();

		long cnid = resolveCnid(materialPlanNodeVO);

		MaterialPlanNodePO materialPlanNodePO = new MaterialPlanNodePO();

		materialPlanNodeVO.clone(materialPlanNodePO);

		materialPlanNodePO.setType(type);
		materialPlanNodePO.setCnid(cnid);
		materialPlanNodePO.setNodeName(resolveNodeName(cnid));
		materialPlanNodePO.setCompany(company);
		materialPlanNodePO.setCreater(userId == null || userId.length() == 0 ? 0L : Long.parseLong(userId));
		materialPlanNodePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		materialPlanNodePO.setStatus(MaterialPlanNodePO.STATUS_ENABLE_SHORT);

		resolveDimension(type, materialPlanNodeVO, materialPlanNodePO);

		if (materialPlanNodeDao.countMaterialPlanNode(company, type, materialPlanNodePO.getCid(), materialPlanNodePO.getBid(), cnid, materialPlanNodePO.getAction()) > 0) {
			throw new FLException(120048, "主材计划规则已存在");
		}

		materialPlanNodeDao.save(materialPlanNodePO);

		materialPlanNodeVO.setMpnid(materialPlanNodePO.getMpnid());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateMaterialPlanNode(MaterialPlanNodeVO materialPlanNodeVO, int company) throws FLException {

		MaterialPlanNodePO materialPlanNodePO = materialPlanNodeDao.get(materialPlanNodeVO.getMpnid());

		if (materialPlanNodePO == null) {
			throw new FLException(120047, "主材计划规则不存在");
		}

		short type = materialPlanNodeVO.getType() == null ? materialPlanNodePO.getType() : materialPlanNodeVO.getType();

		long cnid = resolveCnid(materialPlanNodeVO);

		if (materialPlanNodeVO.getAction() != null) materialPlanNodePO.setAction(materialPlanNodeVO.getAction());
		if (materialPlanNodeVO.getAnchor() != null) materialPlanNodePO.setAnchor(materialPlanNodeVO.getAnchor());
		if (materialPlanNodeVO.getOffsetDay() != null) materialPlanNodePO.setOffsetDay(materialPlanNodeVO.getOffsetDay());
		if (materialPlanNodeVO.getComment() != null) materialPlanNodePO.setComment(materialPlanNodeVO.getComment());

		materialPlanNodePO.setType(type);
		materialPlanNodePO.setCnid(cnid);
		materialPlanNodePO.setNodeName(resolveNodeName(cnid));

		resolveDimension(type, materialPlanNodeVO, materialPlanNodePO);

		if (materialPlanNodeDao.countMaterialPlanNode(company, type, materialPlanNodePO.getCid(), materialPlanNodePO.getBid(), cnid, materialPlanNodePO.getAction()) > 1) {
			throw new FLException(120048, "主材计划规则已存在");
		}

		materialPlanNodeDao.update(materialPlanNodePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateMaterialPlanNodeForStatus(MaterialPlanNodeVO materialPlanNodeVO) throws FLException {

		MaterialPlanNodePO materialPlanNodePO = materialPlanNodeDao.get(materialPlanNodeVO.getMpnid());

		if (materialPlanNodePO == null) {
			throw new FLException(120047, "主材计划规则不存在");
		}

		materialPlanNodePO.setStatus(materialPlanNodeVO.getStatus());

		materialPlanNodeDao.update(materialPlanNodePO);
	}

	// 维度解析: 品类行 bid 固定 0; 品牌行 cid 取品牌归属品类, 并快照两类名称
	private void resolveDimension(short type, MaterialPlanNodeVO materialPlanNodeVO, MaterialPlanNodePO materialPlanNodePO) throws FLException {

		if (type == MaterialPlanNodePO.TYPE_BRAND_SHORT) {

			BrandPO brandPO = brandDao.queryBrandByBid(materialPlanNodeVO.getBid() == null ? materialPlanNodePO.getBid() : materialPlanNodeVO.getBid());

			if (brandPO == null) {
				throw new FLException(130077, "品牌不存在");
			}

			if (brandPO.getCategory() == null) {
				throw new FLException(200118, "品类不存在");
			}

			materialPlanNodePO.setBid(brandPO.getBid());
			materialPlanNodePO.setCid(brandPO.getCategory().getCid());
			materialPlanNodePO.setCategoryName(brandPO.getCategory().getName());
			materialPlanNodePO.setBrandName(brandPO.getName());
		} else {

			CategoryPO categoryPO = categoryDao.queryCategoryByCId(materialPlanNodeVO.getCid() == null ? materialPlanNodePO.getCid() : materialPlanNodeVO.getCid());

			if (categoryPO == null) {
				throw new FLException(200118, "品类不存在");
			}

			materialPlanNodePO.setBid(0L);
			materialPlanNodePO.setCid(categoryPO.getCid());
			materialPlanNodePO.setCategoryName(categoryPO.getName());
			materialPlanNodePO.setBrandName("");
		}
	}

	private long resolveCnid(MaterialPlanNodeVO materialPlanNodeVO) throws FLException {

		long cnid = materialPlanNodeVO.getCnid() == null ? 0L : materialPlanNodeVO.getCnid();

		if (constructionNodeDao.get(cnid) == null) {
			throw new FLException(130026, "工程节点不存在");
		}

		return cnid;
	}

	private String resolveNodeName(long cnid) {

		ConstructionNodePO constructionNodePO = constructionNodeDao.get(cnid);

		return constructionNodePO == null ? "" : constructionNodePO.getName();
	}

}
