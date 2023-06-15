package com.fanglin.sales.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.sales.po.SalesPicturePO;

public interface SalesPictureDao extends Dao<SalesPicturePO> {

	public List<SalesPicturePO> querySalesPictureBySid(Long sid);

	public List<SalesPicturePO> querySalesPictureBySiid(Long siid);

	public int countSalesPicture(Long sid, short type);

}
