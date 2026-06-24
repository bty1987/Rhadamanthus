package com.fanglin.personel.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.personel.po.UserPreferPO;

public interface UserPreferDao extends Dao<UserPreferPO> {

    public UserPreferPO queryUserPrefer(String userId, String module, String page, String pkey, int company);

}
