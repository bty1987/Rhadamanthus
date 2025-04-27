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
import com.fanglin.data.common.dao.BrandServerDao;
import com.fanglin.data.common.dao.ConstructionNodeDao;
import com.fanglin.data.common.service.BrandServerService;
import com.fanglin.data.common.vo.BrandServerVO;
import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.data.po.BrandServerPO;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.utils.BeanUtil;

@Service("BrandServerService")
@Transactional(readOnly = true)
public class BrandServerServiceImpl implements BrandServerService {

	@Autowired
	private BrandServerDao brandServerDao;

	@Autowired
	private BrandDao brandDao;

	@Autowired
	private ConstructionNodeDao constructionNodeDao;

	@Override
	public List<BrandServerVO> queryBrandServer(BrandServerVO brandServerVO) {

		List<BrandServerPO> brandServerPOs = brandServerDao.queryBrandServer(brandServerVO.getBrand().getBid());
		List<BrandServerVO> brandServerVOs = new ArrayList<BrandServerVO>();

		for (BrandServerPO brandServerPO : brandServerPOs) {

			brandServerVOs.add(brandServerPO.ptv(new BrandServerVO(new BrandVO(),new ConstructionNodeVO())));

		}
		return brandServerVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addBrandServer(BrandServerVO brandServerVO) throws FLException {

		if (brandServerVO.getBrand() == null) {
			throw new FLException(130077, "品牌不存在");
		}

		BrandPO brandPO = brandDao.get(brandServerVO.getBrand().getBid());

		if (brandPO == null) {
			throw new FLException(130077, "品牌不存在");
		}

		if (brandServerVO.getConstructionNode() == null) {
			throw new FLException(130026, "工程节点不存在");
		}

		ConstructionNodePO constructionNodePO = constructionNodeDao.get(brandServerVO.getConstructionNode().getCnid());

		if (constructionNodePO == null) {
			throw new FLException(130026, "工程节点不存在");
		}

		BrandServerPO brandServerPO = new BrandServerPO();

		BeanUtil.copyProperties(brandServerVO, brandServerPO, Arrays.asList("constructionNode", "brand"));

		brandServerPO.setBrand(brandPO);
		brandServerPO.setConstructionNode(constructionNodePO);

		brandServerDao.save(brandServerPO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateBrandServer(BrandServerVO brandServer) throws FLException {

		BrandServerPO brandServerPO = brandServerDao.get(brandServer.getBsid());

		if (brandServerPO == null) {
			throw new FLException(130147, "品牌生产信息不存在");
		}

		if (brandServer.getConstructionNode() != null) {
			brandServerPO.setConstructionNode(new ConstructionNodePO(brandServer.getConstructionNode().getCnid()));
		}

		if (brandServer.getComment() != null) {
			brandServerPO.setComment(brandServer.getComment());
		}

		if (brandServer.getWorkNum() != null) {
			brandServerPO.setWorkNum(brandServer.getWorkNum());
		}

		if (brandServer.getName() != null) {
			brandServerPO.setName(brandServer.getName());
		}

		brandServerDao.update(brandServerPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteBrandServer(BrandServerVO brandServer) throws FLException {

		BrandServerPO brandServerPO = brandServerDao.get(brandServer.getBsid());

		brandServerDao.delete(brandServerPO);
	}

}
