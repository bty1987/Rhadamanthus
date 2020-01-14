package com.fanglin.inventory.service;


import java.util.List;

import com.fanglin.inventory.vo.AccessoriesManifestVO;
import com.fanglin.inventory.vo.ManifestVO;

public interface AccessoriesManifestService {
	
	public List<ManifestVO> queryManifestByAid(AccessoriesManifestVO accessoriesManifestVO);

}
