package com.fanglin.inventory.service.impl;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.inventory.dao.AccessoriesManifestDao;
import com.fanglin.inventory.po.AccessoriesManifestPO;
import com.fanglin.inventory.po.ManifestPO;
import com.fanglin.inventory.service.AccessoriesManifestService;
import com.fanglin.inventory.vo.AccessoriesVO;
import com.fanglin.inventory.vo.ManifestVO;
import com.fanglin.utils.BeanUtil;


@Service("accessoriesManifestService")
@Transactional(readOnly = true)
public class AccessoriesManifestServiceImpl implements AccessoriesManifestService {
	
	@Autowired
	private AccessoriesManifestDao accessoriesManifestDao;

	@Override
	public ManifestVO queryManifestByAid(AccessoriesVO accessoriesVO) {
		
		AccessoriesManifestPO accessoriesManifestPO = accessoriesManifestDao.queryManifestByAid(accessoriesVO.getAid());
		
		ManifestPO manifestPO = accessoriesManifestPO.getManifest();
		
		ManifestVO manifestVO = new ManifestVO();
		
		BeanUtil.copyProperties(manifestPO, manifestVO, Arrays.asList("createUser","quoteManifest"));
		
		return manifestVO;
				
	}

}
