package com.fanglin.inventory.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.inventory.dao.AccessoriesManifestDao;
import com.fanglin.inventory.po.AccessoriesManifestPO;
import com.fanglin.inventory.service.AccessoriesManifestService;
import com.fanglin.inventory.vo.AccessoriesManifestVO;
import com.fanglin.inventory.vo.ManifestVO;
import com.fanglin.utils.BeanUtil;

@Service("accessoriesManifestService")
@Transactional(readOnly = true)
public class AccessoriesManifestServiceImpl implements AccessoriesManifestService {

	@Autowired
	private AccessoriesManifestDao accessoriesManifestDao;

	@Override
	public List<ManifestVO> queryManifestByAid(AccessoriesManifestVO accessoriesManifestVO) {
		
		List<AccessoriesManifestPO> accessoriesManifestPOs = accessoriesManifestDao.queryManifestByAid(accessoriesManifestVO.getAccessories().getAid(), accessoriesManifestVO.getManifest().getType());
		
		List<ManifestVO> manifestVOs = new ArrayList<ManifestVO>();
		
		for(AccessoriesManifestPO accessoriesManifestPO : accessoriesManifestPOs){
			
			ManifestVO manifestVO =new ManifestVO();
			BeanUtil.copyProperties(accessoriesManifestPO.getManifest(), manifestVO, Arrays.asList("creater", "quoteManifest"));
			manifestVOs.add(manifestVO);
			
		}
		
		return manifestVOs;
		
	}

}
