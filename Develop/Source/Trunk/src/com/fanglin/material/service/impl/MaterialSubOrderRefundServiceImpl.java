/**
 * @File Name		: MaterialSubOrderRefundServiceImpl.java
 * @Package   	: com.fanglin.service.impl.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-10-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.material.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.material.dao.MaterialSubOrderRefundDao;
import com.fanglin.material.po.MaterialSubOrderRefundPO;
import com.fanglin.material.service.MaterialSubOrderRefundService;
import com.fanglin.material.vo.MaterialSubOrderRefundVO;
import com.fanglin.utils.BeanUtil;

@Service("materialSubOrderRefundService")
@Transactional(readOnly=true)
public class MaterialSubOrderRefundServiceImpl implements MaterialSubOrderRefundService {
	
	@Autowired
	private MaterialSubOrderRefundDao materialSubOrderRefundDao;
	
	@Override
	public List<MaterialSubOrderRefundVO> queryMaterialSubOrderRefundByMsoIdAIdents(long msoId, List<Integer> idents){
		
		List<MaterialSubOrderRefundPO> materialSubOrderRefundPOs;
		
		if(idents == null || idents.size() == 0){
			materialSubOrderRefundPOs = materialSubOrderRefundDao.queryMaterialSubOrderRefundByMsoId(msoId);
		}else{
			materialSubOrderRefundPOs = materialSubOrderRefundDao.queryMaterialSubOrderRefundByMsoIdIdents(msoId, idents);
		}
		
		List<MaterialSubOrderRefundVO> materialSubOrderRefundVOs = new ArrayList<MaterialSubOrderRefundVO>();
		
		Map<String, MaterialSubOrderRefundVO> packageFlagMap = new HashMap<String, MaterialSubOrderRefundVO>();
		Map<String, List<MaterialSubOrderRefundVO>> packageItemsMap = new HashMap<String, List<MaterialSubOrderRefundVO>>();
		
		List<MaterialSubOrderRefundVO> packageItemsList = null;
		
		int _id = 0;
		
		for(MaterialSubOrderRefundPO materialSubOrderRefundPO: materialSubOrderRefundPOs){
			MaterialSubOrderRefundVO materialSubOrderRefundVO = new MaterialSubOrderRefundVO();
			BeanUtil.copyProperties(materialSubOrderRefundPO, materialSubOrderRefundVO);
			materialSubOrderRefundVO.setIsLeaf(true);
			materialSubOrderRefundVO.setExpanded(false);
			
			if(materialSubOrderRefundPO.getNum() == 0){
				continue;
			}
			
			if(!"".equals(materialSubOrderRefundPO.getPackageName())){
				String packageName = materialSubOrderRefundPO.getPackageName();
				int ident = materialSubOrderRefundPO.getIdent();
				MaterialSubOrderRefundVO materialSubOrderRefundPackage = null;
				
				String packageNameIdent = packageName+ident;
				
				if(!packageFlagMap.containsKey(packageNameIdent)){
					materialSubOrderRefundPackage = new MaterialSubOrderRefundVO();
				
					materialSubOrderRefundPackage.setMaterialModelName("-");
					materialSubOrderRefundPackage.setMaterialTypeName("-");
					materialSubOrderRefundPackage.setMaterialBrandName("-");
					materialSubOrderRefundPackage.setMeasurementUnitName("-");
					
					materialSubOrderRefundPackage.setMaterialModelNo(packageName);
					materialSubOrderRefundPackage.setPackageName(packageName);
					materialSubOrderRefundPackage.setTotal(materialSubOrderRefundPO.getTotal());
					materialSubOrderRefundPackage.setMsoId(materialSubOrderRefundPO.getMsoId());
					materialSubOrderRefundPackage.setStatus(materialSubOrderRefundPO.getStatus());
					materialSubOrderRefundPackage.setIdent(materialSubOrderRefundPO.getIdent());
					
					materialSubOrderRefundPackage.setLevel(0);
					materialSubOrderRefundPackage.setIsLeaf(false);
					materialSubOrderRefundPackage.setParent(-1);
					materialSubOrderRefundPackage.setExpanded(true);
					
					materialSubOrderRefundVO.setLevel(1);
					materialSubOrderRefundVO.setTotal(0f);
					
					packageFlagMap.put(packageNameIdent, materialSubOrderRefundPackage);
					
					packageItemsList = new ArrayList<MaterialSubOrderRefundVO>();
					packageItemsList.add(materialSubOrderRefundVO);
					
					packageItemsMap.put(packageNameIdent, packageItemsList);
				
				}else{
					packageItemsList = packageItemsMap.get(packageNameIdent);
					
					materialSubOrderRefundPackage = packageFlagMap.get(packageNameIdent);
					materialSubOrderRefundVO.setLevel(1);
					materialSubOrderRefundVO.setTotal(0f);
					
					packageItemsList.add(materialSubOrderRefundVO);
				}
			}else{
				materialSubOrderRefundVO.setId(++_id);
				materialSubOrderRefundVO.setLevel(0);
				materialSubOrderRefundVO.setParent(-1);
				
				materialSubOrderRefundVOs.add(materialSubOrderRefundVO);
			}
		}
		
		for(String packageNameIdent: packageFlagMap.keySet()){
			MaterialSubOrderRefundVO packageItem = packageFlagMap.get(packageNameIdent);
			packageItem.setId(++_id);
			materialSubOrderRefundVOs.add(packageItem);
			
			packageItemsList = packageItemsMap.get(packageNameIdent);
			
			for(MaterialSubOrderRefundVO materialSubOrderRefundVO: packageItemsList){
				materialSubOrderRefundVO.setId(++_id);
				materialSubOrderRefundVO.setParent(packageItem.getId());
				materialSubOrderRefundVOs.add(materialSubOrderRefundVO);
			}
		}
		
		return materialSubOrderRefundVOs;
	}

}
