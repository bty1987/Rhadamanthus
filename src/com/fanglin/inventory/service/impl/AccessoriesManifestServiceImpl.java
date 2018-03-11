package com.fanglin.inventory.service.impl;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.inventory.dao.AccessoriesManifestDao;
import com.fanglin.inventory.po.AccessoriesManifestPO;
import com.fanglin.inventory.service.AccessoriesManifestService;
import com.fanglin.inventory.vo.AccessoriesManifestVO;
import com.fanglin.inventory.vo.AccessoriesVO;
import com.fanglin.inventory.vo.ManifestVO;
import com.fanglin.utils.BeanUtil;


@Service("accessoriesManifestService")
@Transactional(readOnly = true)
public class AccessoriesManifestServiceImpl implements AccessoriesManifestService {
	
	@Autowired
	private AccessoriesManifestDao accessoriesManifestDao;

	@Override
	public AccessoriesManifestVO queryAccessoriesManifestByAid(AccessoriesManifestVO accessoriesManifestVO) {
		
		AccessoriesManifestPO accessoriesManifestPO = accessoriesManifestDao.queryAccessoriesManifestByAid(accessoriesManifestVO.getAccessories().getAid());
		
		accessoriesManifestVO = new AccessoriesManifestVO(new AccessoriesVO(),new ManifestVO());
		
		BeanUtil.copyProperties(accessoriesManifestPO, accessoriesManifestVO, Arrays.asList("accessories","manifest"));
		BeanUtil.copyProperties(accessoriesManifestPO.getAccessories(), accessoriesManifestVO.getAccessories(), Arrays.asList("house","creater","approver","supervisor","fetchTime","company"));
		BeanUtil.copyProperties(accessoriesManifestPO.getManifest(), accessoriesManifestVO.getManifest(), Arrays.asList("createUser","quoteManifest"));
		
		return accessoriesManifestVO;
				
	}

}
