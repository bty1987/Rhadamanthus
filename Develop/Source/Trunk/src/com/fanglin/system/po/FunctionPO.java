package com.fanglin.system.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "function", catalog = "communion")
public class FunctionPO implements Serializable {

	private static final long serialVersionUID = 8882188430338671991L;

	private int id;
	
	private int functionId;
	
	private String functionName;
	
	private ModulePO module;
	
	private String functionIcon;
	
	private String functionDes;
	
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	public int getId(){
		return id;
	}

	public void setId(int id){
		this.id = id;
	}
	
	@Id
	@Column(name = "functionId", nullable = false)
	public int getFunctionId(){
		return functionId;
	}
	
	public void setFunctionId(int functionId){
		this.functionId = functionId;
	}

	@Column(name = "functionName", nullable = false)
	public String getFunctionName(){
		return functionName;
	}

	public void setFunctionName(String functionName){
		this.functionName = functionName;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(nullable = false, name = "moduleId")
	public ModulePO getModule(){
		return module;
	}

	public void setModule(ModulePO module){
		this.module = module;
	}

	public String getFunctionIcon(){
		return functionIcon;
	}
	public void setFunctionIcon(String functionIcon){
		this.functionIcon = functionIcon;
	}

	public String getFunctionDes(){
		return functionDes;
	}

	public void setFunctionDes(String functionDes){
		this.functionDes = functionDes;
	}

}
