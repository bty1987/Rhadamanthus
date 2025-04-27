package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.BrandDao;
import com.fanglin.communion.po.BrandPO;
import com.fanglin.communion.vo.BrandVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.dao.BrandDeliverDao;
import com.fanglin.data.common.dao.ConstructionNodeDao;
import com.fanglin.data.common.service.BrandDeliverService;
import com.fanglin.data.common.vo.BrandDeliverVO;
import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.data.po.BrandDeliverPO;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.utils.BeanUtil;

@Service("BrandDeliverService")
@Transactional(readOnly = true)
public class BrandDeliverServiceImpl implements BrandDeliverService {

	@Autowired
	private BrandDeliverDao brandDeliverDao;

	@Autowired
	private BrandDao brandDao;

	@Autowired
	private ConstructionNodeDao constructionNodeDao;

	@Override
	public List<BrandDeliverVO> queryBrandDeliver(BrandDeliverVO brandDeliverVO) {

		List<BrandDeliverPO> brandDeliverPOs = brandDeliverDao.queryBrandDeliver(brandDeliverVO.getBrand().getBid());
		List<BrandDeliverVO> brandDeliverVOs = new ArrayList<BrandDeliverVO>();

		for (BrandDeliverPO brandDeliverPO : brandDeliverPOs) {

			brandDeliverVOs.add(brandDeliverPO.ptv(new BrandDeliverVO(new BrandVO(),new ConstructionNodeVO())));
		}

		return brandDeliverVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addBrandDeliver(BrandDeliverVO brandDeliverVO) throws FLException {

		if (brandDeliverVO.getBrand() == null) {
			throw new FLException(130077, "品牌不存在");
		}

		BrandPO brandPO = brandDao.get(brandDeliverVO.getBrand().getBid());

		if (brandPO == null) {
			throw new FLException(130077, "品牌不存在");
		}

		if (brandDeliverVO.getConstructionNode() == null) {
			throw new FLException(130026, "工程节点不存在");
		}

		ConstructionNodePO constructionNodePO = constructionNodeDao.get(brandDeliverVO.getConstructionNode().getCnid());

		if (constructionNodePO == null) {
			throw new FLException(130026, "工程节点不存在");
		}

		BrandDeliverPO brandDeliverPO = new BrandDeliverPO();

		BeanUtil.copyProperties(brandDeliverVO, brandDeliverPO, Arrays.asList("constructionNode", "brand"));

		brandDeliverPO.setBrand(brandPO);
		brandDeliverPO.setConstructionNode(constructionNodePO);

		brandDeliverDao.save(brandDeliverPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateBrandDeliver(BrandDeliverVO brandDeliverVO) throws FLException {

		BrandDeliverPO brandDeliverPO = brandDeliverDao.get(brandDeliverVO.getBdid());

		if (brandDeliverPO == null) {
			throw new FLException(130144, "品牌配送信息不存在");
		}

		if (brandDeliverVO.getConstructionNode() != null) {
			brandDeliverPO.setConstructionNode(new ConstructionNodePO(brandDeliverVO.getConstructionNode().getCnid()));
		}
		
		if (brandDeliverVO.getComment() != null) {
			brandDeliverPO.setComment(brandDeliverVO.getComment());
		}

		if (brandDeliverVO.getWorkNum() != null) {
			brandDeliverPO.setWorkNum(brandDeliverVO.getWorkNum());
		}

		if (brandDeliverVO.getName() != null) {
			brandDeliverPO.setName(brandDeliverVO.getName());
		}

		brandDeliverDao.update(brandDeliverPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteBrandDeliver(BrandDeliverVO brandDeliver) throws FLException {

		BrandDeliverPO brandDeliverPO = brandDeliverDao.get(brandDeliver.getBdid());

		brandDeliverDao.delete(brandDeliverPO);
	}

}
