package com.fanglin.inventory.service;


import com.fanglin.inventory.vo.AccessoriesVO;
import com.fanglin.inventory.vo.ManifestVO;

public interface AccessoriesManifestService {
	
	public ManifestVO queryManifestByAid(AccessoriesVO accessoriesVO);

}
