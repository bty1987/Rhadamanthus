package com.fanglin.store.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;


import com.fanglin.store.po.AddressPO;

public interface AddressDao extends Dao<AddressPO>{

	public List<AddressPO> queryAddressByUid(long uid);

	public void updateAddressByUid(long uid);

}
